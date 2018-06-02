//题目信息
function questionInfo(){
    this.isRight = true     // 答案是对还是错
    this.dfd = 0            // 难度系数
    this.questionStr = ""   // 题目
    this.t = 5              // 时间
}

// 产生随机数 1 ~ base
function randomNumber(base){
    return parseInt((base+1)*Math.random())
}


function getQuestionStr(question, j, result, a, b, c, d){
  if (j == 1) {
    c = ">"
    let offset = randomNumber(1) + 1
    if (question.isRight) {
      question.questionStr = `${a}${d}${b}${c}${result - offset}`
    } else {
      question.questionStr = `${a}${d}${b}${c}${result + offset}`
    }
  } else if (j == 0) {
    c = "="
    let offset = randomNumber(1) + 1
    if (question.isRight) {
      question.questionStr = `${a}${d}${b}${c}${result}`
    } else {
      let k = randomNumber(1) 
      if (k == 0) {
        question.questionStr = `${a}${d}${b}${c}${result + offset}`
      } else {
        question.questionStr = `${a}${d}${b}${c}${result - offset}`
      }
    }
  } else if (j == 2) {
    c = "<"
    let offset = randomNumber(1) + 1
    if (question.isRight) {
      question.questionStr = `${a}${d}${b}${c}${result + offset}`
    } else {
      question.questionStr = `${a}${d}${b}${c}${result - offset}`
    }
  }
}

// 得到一个题目
function ramdomQuestion(base, n){
   var question = new questionInfo()
   question.isRight = randomNumber(1)
   question.dfd = parseInt(n / 10)
   
   let j = 0
   let offset = 1
   if (question.dfd == 0 || question.dfd == 1){
     question.t = 5
     offset = parseInt(question.dfd * parseFloat(n / (randomNumber(base) + 1))) + n
   } else if (question.dfd == 2) {
     question.t = 4
     offset = parseInt(question.dfd * parseFloat(n / (randomNumber(base) + 1))) + n
     j = randomNumber(1) + 1   // 1 > 1  2 <  0 =
   } else if (question.dfd == 3 || question.dfd == 4) {
     question.t = 3
     offset = parseInt(question.dfd * parseFloat(n/(randomNumber(base)+1))) + n
     j = randomNumber(1) + 1    // 1 > 2 < 0 =
   }

   let a = randomNumber(base) + offset, //数字1
       b = randomNumber(base) + offset, //数字2
       c = ">",                //加减
       d = "+";                //题目 > = <

   let i = randomNumber(1)  // 0 + 1 -
  
   if(i == 0){
      let result = a + b
      getQuestionStr(question, j, result, a, b, c, d)
   } else {
      let result = a - b;
      d = "-"
      getQuestionStr(question, j, result, a, b, c, d)
   }
   return question;
}


//生成题库
function genQuestionInfos(count){
   var questionInfos = []
   for(var i = 1; i <= count; i++){
      questionInfos.push(ramdomQuestion(10, i))
   }
   return questionInfos
}


module.exports = {
  genQuestionInfos: genQuestionInfos
}