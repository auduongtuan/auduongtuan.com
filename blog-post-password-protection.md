# Implement Password-Protected Content for Static Pages (like Next.js)

I have some weird and ridiculous posts that I only want certain people to read, and projects that I only want recruiters with a password to view. But how do you hide content on a static site without losing all the benefits of static generation? 🤔

That's the problem I solved by building a password protection system for my Next.js website. It encrypts content server-side and only decrypts it when someone enters the right password. No server calls needed! While I built this for Next.js, the same approach works with any static site generator like Gatsby, Hugo, or Jekyll.

Here's how I built it:

## Step 1: Encrypt Content During Build Time

First, I needed to make sure nobody could peek at the protected content by viewing the page source. The solution? Encrypt everything during build time! 🔒

I store my passwords in Notion (because I store everything in Notion 😅), and during the build process, I check if a post needs protection:

```typescript
// In getStaticProps
const post = await getPost(slug);
let content = JSON.stringify(post.content);

// Is this post for my eyes only?
if (post.protected) {
  // Get the password from Notion
  const password = await getPassword(post.passwordId);
  
  // Encrypt the content with CryptoJS
  content = CryptoJS.AES.encrypt(content, password.value).toString();
  
  // Save hint and password length (but not the actual password!)
  passwordInfo = {
    hint: password.hint,
    length: password.value.length
  };
}

return { props: { content, passwordInfo } };
```

Now when someone views the page source, they just see a bunch of encrypted gibberish. Good luck making sense of that! 😈

## Step 2: Decrypt Content When the Password Is Right

Now for the fun part! When someone visits a protected page, they'll need to enter a password. But how do we check if it's right without sending it to a server? 🤓

I used Zustand for state management (it's like Redux but way less boilerplate) and set up a simple store:

```typescript
// A super simple store for our password state
const usePasswordStore = create((set) => ({
  password: '',
  content: null,
  error: null,
  setPassword: (pwd) => set({ password: pwd }),
  setContent: (content) => set({ content, error: null }),
  setError: (error) => set({ error })
}));
```

Then I created a component that tries to decrypt the content whenever the password changes:

```typescript
function PasswordProtect({ encrypted, passwordInfo }) {
  const { password, setPassword, setContent, error, setError } = usePasswordStore();
  
  // When password reaches the right length, try to decrypt
  useEffect(() => {
    if (password.length === passwordInfo.length) {
      try {
        // The moment of truth! 🔥
        const bytes = CryptoJS.AES.decrypt(encrypted, password);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        
        // If we get here, the password worked!
        setContent(JSON.parse(decrypted));
        
        // Track it for analytics (I'm curious who's trying to see my weird posts)
        trackEvent({
          event: "password_success",
          page: window.location.pathname
        });
      } catch {
        // Wrong password, better luck next time
        setError('INCORRECT_PASSWORD');
        
        // Also track failed attempts (for science, of course)
        trackEvent({
          event: "password_fail",
          page: window.location.pathname
        });
      }
    }
  }, [password]);
  
  return (
    <div className="password-container">
      <h3>This content is password-protected</h3>
      <p>Hint: {passwordInfo.hint || "No hint for you! 😜"}</p>
      
      <PasswordField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        maxLength={passwordInfo.length}
        error={error}
      />
    </div>
  );
}
```

## Step 3: Build a Fancy Password Field

The default password input is boring and doesn't give users any visual feedback. I wanted something cooler—a field that shows individual character slots and gives visual feedback as you type. 👌

Here's the trick: I created a layered input where the actual input is invisible, and what the user sees is a custom UI that reacts to the input's state.

```typescript
function PasswordField({ value, onChange, maxLength, error }) {
  // Track focus state for visual feedback
  const [focused, setFocused] = useState(false);
  // Track selection for highlighting
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  
  return (
    <div className={`field ${focused ? 'focused' : ''}`}>
      {/* The pretty visual layer */}
      <div className="visual-container">
        {/* Show characters that have been typed */}
        {value.split('').map((char, i) => (
          <span key={i} className="char">*</span>
        ))}
        
        {/* Show the blinking cursor when focused */}
        {focused && <span className="cursor" />}
        
        {/* Show placeholders for remaining characters */}
        {Array.from({ length: maxLength - value.length }).map((_, i) => (
          <span key={i} className="placeholder"></span>
        ))}
      </div>
      
      {/* The real input that captures keystrokes (but is invisible) */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSelect={(e) => {
          // Update selection highlight when text is selected
          setSelection({
            start: e.currentTarget.selectionStart || 0,
            end: e.currentTarget.selectionEnd || 0
          });
        }}
        maxLength={maxLength}
        className="hidden-input"
      />
      
      {/* Show error message if needed */}
      {error && <p className="error">Nice try, but that's not right! 😉</p>}
    </div>
  );
}
```

The magic happens because the real input is positioned absolutely on top of our visual layer but is transparent. It captures all keyboard events while our custom UI shows what's happening. This gives us complete control over the appearance while maintaining all the native input behavior. 🧙‍♂️

## Putting It All Together

In the page component, we combine these elements to create a complete password protection system:

```typescript
function BlogPost({ content, passwordInfo }) {
  const { content: decrypted } = usePasswordStore();
  
  // Show decrypted content if available
  if (decrypted) {
    return <BlogContent content={decrypted} />;
  }
  
  // Show password form if protection is enabled
  if (passwordInfo.length > 0) {
    return <PasswordProtect encrypted={content} passwordInfo={passwordInfo} />;
  }
  
  // Show regular content if no protection
  return <BlogContent content={JSON.parse(content)} />;
}
```

## Security Considerations

While this approach provides a good level of protection, it's important to note some limitations:

1. The encryption is only as strong as the password used
2. If someone obtains both the encrypted content and the password, they can decrypt it
3. This approach is best for content that needs casual protection, not highly sensitive information

For truly sensitive data, server-side authentication with proper session management would be more appropriate.

## Why I Love This Approach

This password protection system gives me the best of both worlds:

1. **Static site benefits** - My site stays blazing fast with all the SEO benefits
2. **No server needed** - Everything happens client-side, so no complex auth servers
3. **Great UX** - The custom password field makes the whole experience feel polished

Plus, there's something satisfying about implementing a clever solution that doesn't require a complete architecture overhaul. Sometimes the simplest solutions are the most elegant! ✨

Now I can keep posting my weird content without worrying about just anyone stumbling across it. If you want to see it, you'll need the secret password - and no, it's not "password123"! 😄

Remember that the level of security should match the sensitivity of your content. For most use cases, this implementation strikes a good balance between protection and convenience.
