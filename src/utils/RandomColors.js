  // avatar colors 
  export default function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  //   const colors = ['#FF0000', '#0000FF', '#3c753c', '#3498db', '#FF00FF', '#00FFFF'];
  // const randomIndex = Math.floor(Math.random() * colors.length);
  // return colors[randomIndex];
    return color;
  }