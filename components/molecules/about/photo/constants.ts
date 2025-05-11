import { Photo } from "./types";

export const PHOTOS: Photo[] = [
  {
    id: 1,
    name: "Cute Tuấn",
    description:
      "Lập xuân đua nở hoa đào 🌸\nTim cậu liệu có ai vào hay chưa? 😳",
    image: "/about/portrait1.jpg",
  },
  {
    id: 2,
    name: "Healthy Tuấn",
    description:
      "Tuấn ra phố cổ\nTìm báo thủ đô\nAi dè bỗng hóa\nBáo thủ (sắp) đô",
    image: "/about/portrait2.jpg",
  },
  {
    id: 3,
    name: "Tipsy Tuấn",
    description:
      "Nô en không bồ, chốn quê xa\nLương tháng mười ba, nằm mơ à\nChỉ có bia lon và khô mực\nNgồi nhậu một chút, khóc ngân nga",
    image: "/about/portrait3.jpg",
  },
  {
    id: 4,
    name: "Moody Tuấn",
    description:
      "dòng đời lắm buồn vương\nlạc chút thoắt lỡ đường\nchẳng biết sai hay đúng\ntrong ngoài hóa nhiễu nhương",
    image: ["/about/portrait4.jpg", "/about/portrait10.jpg"],
  },
  {
    id: 5,
    name: "Wanderlusty Tuấn",
    description:
      "Mũi Điện, bình minh, đón sớm mai\nĐồng Hoà chốn cũ, chẳng mau phai\nNgười xưa phút chốc bề gia thất\nChỉ mãi tôi hoài chẳng có ai",
    image: "/about/portrait5.jpg",
  },
  {
    id: 6,
    name: "Artistic Tuấn",
    description:
      "Bát Tràng đồ gốm tinh hoa\nMón nào cũng muốn xuyết xoa đem về",
    image: "/about/portrait6.jpg",
  },
  {
    id: 7,
    name: "Workaholic Tuấn",
    description:
      "ngày buồn cày job quạnh hiu\nnắng tàn phai sắc buổi chiều xôn xao\ndẫu lòng vẫn khát thương trao\nmà tim chẳng dám gửi vào một ai",
    image: "/about/portrait7.jpg",
  },
  {
    id: 8,
    name: "Trầm-đoán Tuấn",
    description:
      "Cung điện tráng lệ nguy nga\nTuấn bỗng trầm đoán sâu xa lạ thường\nTrong lòng có nhiều vấn vương\nMặt ngoài tự vấn nào lương mới về",
    image: "/about/portrait8.jpg",
  },
  {
    id: 9,
    name: "Happy Tuấn",
    description:
      "Hồ gươm dậy sớm, đón bình minh\nMặt nước an nhiên, cảnh lặng thinh\nHứng khởi trong lòng, ta vận động\nTrong ngoài vui khỏe, người tươi xinh",
    image: "/about/portrait9.jpg",
  },
];

export const SWIPE_COMPLETE_THRESHOLD = 100; // how far user needs to swipe to trigger action
// const SWIPE_THRESHOLD = 20; // original AI suggest
export const SWIPE_START_THRESHOLD = 2;

export const CARD_STACK_TRANSLATE_Y_OFFSET = 7;
export const CARD_STACK_SCALE_OFFSET = 0.01;
