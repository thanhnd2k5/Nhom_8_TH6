export interface DestinationBudget {
  id: string;
  name: string;
  eat: number;
  move: number;
  stay: number;
  description?: string;
  image?: string;
}

export const scheduleData: DestinationBudget[] = [
  { 
    id: "1", 
    name: "Đà Lạt", 
    eat: 500000, 
    move: 300000, 
    stay: 700000,
    description: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm",
    image: "https://i.imgur.com/JfxDDgH.jpeg"
  },
  { 
    id: "2", 
    name: "Nha Trang", 
    eat: 400000, 
    move: 200000, 
    stay: 600000,
    description: "Thành phố biển với bãi cát trắng và nước biển trong xanh",
    image: "https://i.imgur.com/3VWxKvs.jpeg"
  },
  { 
    id: "3", 
    name: "Hội An", 
    eat: 450000, 
    move: 250000, 
    stay: 550000,
    description: "Phố cổ với những đèn lồng rực rỡ và kiến trúc cổ kính",
    image: "https://i.imgur.com/V9BluDY.jpeg"
  },
  { 
    id: "4", 
    name: "Hạ Long", 
    eat: 600000, 
    move: 500000, 
    stay: 800000,
    description: "Vịnh biển với hàng nghìn hòn đảo đá vôi",
    image: "https://i.imgur.com/CIyYP6e.jpeg"
  },
  { 
    id: "5", 
    name: "Sapa", 
    eat: 350000, 
    move: 400000, 
    stay: 500000,
    description: "Thị trấn vùng cao với những ruộng bậc thang và văn hóa dân tộc đặc sắc",
    image: "https://i.imgur.com/QFyZS4Z.jpeg"
  }
]; 