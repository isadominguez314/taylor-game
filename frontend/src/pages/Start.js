// import React, {useState} from "react";

// const [numRounds, setNumRounds] = useState(0);
// const [song, setSong] = useState("");

// async function pullFromBackend(){
//   fetch("http://localhost:8080/?").then((result) => 
//   result = result.json()).then((data) => {setSong(data)})
//   console.log('song', song);
// }

// function startGame() {
//   pullFromBackend();
// }

// const Start = ({numRounds}) => {
//   <div className = "start-screen">
//   <h1> TAYLOR SWIFT LYRIC GAME </h1>
//   <h4> INSTRUCTIONS: You will be presented with a random lyric from a Taylor Swift song. Your goal is to guess the name of the song and the following lyric. You have 3 guesses for each input and you can request album and previous lyric hints. The album hint will change the background of the game to the color matching the target lyric's album. The previous lyric hint will provide you with the lyric that preceded the target lyric. If you are stumped, you can reveal the song title, the next lyric, or you can skip the question. You can choose to play 5 rounds or you can choose free play and end the game when you are ready.</h4>
//   <h4> SCORING: Every question has 20 available points. 10 points is available for the correct song and 10 points is available for the next lyric. Each incorrect guess and hint used decreases the available points by 2. If you skip the question or reveal an answer, no points are earned.</h4>
//   {numRounds === 0 ? <div> <h4> How Many Rounds Would You Like To Play? </h4> <button class="unclicked-button" onClick={() => setNumRounds(5)} > 5 Rounds </button> <button class="unclicked-button" onClick={() => setNumRounds(-1)}> Free Play </button> </div>: <button class="unclicked-button" onClick={startGame}> Click Here To Play </button>}
//   </div>
// };
  
//   export default Start;
