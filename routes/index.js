// 공통 페이지 제공(로그인, 회원가입, 암호찾기)

var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("index.ejs", { title: "메인페이지" });
});

// 로그인 웹페이지 GET 요청 - login 웹페이지 응답
router.get("/login", function (req, res, next) {
  res.render("login.ejs");
});

// 로그인처리 POST 요청 - 로그인 처리 및 채팅 페이지 이동
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  console.log("로그인 시도 아이디, 비번: ", email, password);
  res.redirect("/chat");
});

// 회원가입 웹페이지 GET 요청 - 회원가입 웹페이지 응답
router.get("/entry", function (req, res, next) {
  res.render("entry.ejs");
});

// 회원가입 처리 POST 요청 - 회원가입 처리 후 로그인페이지 이동
router.post("/entry", function (req, res, next) {
  const { name, password, nickname, email } = req.body;
  console.log("회원가입 정보: ", name, password, nickname, email);
  res.redirect("/login");
});

// 암호 찾기 웹 페이지 GET 요청 - 암호찾기 웹페이지 응답
router.get("/find", function (req, res, next) {
  res.render("find.ejs");
});

// 암호찾기 처리 POST 요청 - 암호 찾기 완료 후 로그인 페이지 이동처리
router.post("/find", function (req, res, next) {
  const { nickname, email } = req.body;
  console.log("암호찾기 사용자 입력 정보: ", nickname, email);
  res.redirect("/login");
});

module.exports = router;
