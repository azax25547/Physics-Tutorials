let name;
const show = (e) => {
  name = document.querySelector(".w3-input").value;
  if(!name){
    alert("Please specify your name!!");
    return false;
  }
  document.getElementById("quiz").style.display = "block";
  document.getElementById("body").style.display = "none";
  document.getElementById("btn-home").style.display = "none";
  document.getElementById("timer").innerHTML = 20 + ":" + 00;
  startTimer();
};

let result;
let correctAnswers = [];

const startTimer = () => {
  let presentTime = document.getElementById("timer").innerHTML;
  let timeArray = presentTime.split(/[:]+/);
  let m = timeArray[0];
  let s = checkSecond(timeArray[1] - 1);
  if (s == 59) {
    m = m - 1;
  }
  if (m < 0) {
    if (result === undefined) {
      alert(`You have not attempted any questions. Please attempt them.`);
      window.location.reload();
    } else {
        getResult();
    }
  }

  document.getElementById("timer").innerHTML = m + ":" + s;
  setTimeout(startTimer, 1000);
}

const checkSecond = (sec) => {
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  } // add zero in front of numbers < 10
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}


const getQuestion = () => {
 

  $.ajax({
    type: "GET",
    url: "app.json",
    dataType: "json",
    success(data) {
      data.forEach((element, index) => {
        $("#app").append(`<div><b>${index + 1}. ${element.question}</b>
                    <div class='ans  w3-padding-16 w3-margin-left'>
                    ${element.answer.map(
                      val =>
                        `<input type='radio' class=' ${
                          element.answer[0]
                        }' name='${
                          element.answer[0]
                        }' value='${val}' > ${val} <br> `
                    )}
                    </div>
               </div> \n`);
      });
    },
    error(data) {
      alert(data);
    }
  });
};

getQuestion();

const getResult = () => {
    document.getElementById(
        "result"
      ).innerHTML = `You have scored ${result} out of 10  <b>${name}</b> <br>`;
      if(result === 10){
        $("#result").append("<span class='text-success w3-large'>Congrats!! You have passed the test");
      }else if(result >= 3){
        $("#result").append("<span class='text-warning  w3-large'>OK!! You did well try to score better");
      }else{
        $("#result").append("<span class='text-danger  w3-large'>WTF!!Please study something before attempteing</span>");
      }
      $("#result").append("<br>The Correct results are :")
      document.getElementById("timer").style.display = "none";
      document.getElementById("app").style.display = "none";
      document.getElementById("btn").style.display = "none";
      document.getElementById("btn-strt").style.display = "none";
      document.getElementById("btn-home").style.display = "block";
      getCorrectResult();
} 

$("#btn").on("click", () => {
  $.ajax({
    type: "GET",
    url: "app.json",
    dataType: "json",
    success(data) {
      data.forEach(element => correctAnswers.push(element.correct_answer));
      checkResult();
    },
    error(data) {
      alert(data);
    }
  });
  //get answer value and put them in an array
  const checkResult = () => {
    let arr = [];
    correctAnswers.map(val => val);
    //console.log(correctAnswers);
    let radios = document.getElementsByTagName("input");
    for (i = 0; i < radios.length; i++) {
      if (radios[i].type == "radio" && radios[i].checked) {
        arr.push(radios[i].value);
      }
    }
    //console.log(arr);

    const finalArr = [];
    arr.forEach(e1 =>
      correctAnswers.forEach(e2 => {
        if (e1 === e2) {
          finalArr.push(e1);
        }
      })
    );
    //console.log(finalArr);
    result = finalArr.length;
    if (result === 0) {
      alert(`You have not attempted any questions. Please attempt them.`);
    } else {
      getResult();
    }
  };
});

const getCorrectResult = () => {
    correctAnswers.forEach((element,index) => {
        $("#result").append(`<br> ${index+1}. ${element}`)
    })
}
