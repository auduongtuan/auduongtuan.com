module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'e9f32cd12d5acb3f049de86138c7ab06'),
  },
});
