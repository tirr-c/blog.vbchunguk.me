---
title: Rust 라이프타임 생략 규칙
keywords:
  - rust
---

오래 전에 GitHub Gist에 정리해서 올려 뒀던 내용인데, 정리한 내용이 의외로 자주
쓰여서 조금 개선한 뒤에 블로그 포스트로 만들어 놓기로 했습니다.

---

라이프타임은 타입의 일부이기 때문에, 기본적으로 함수 정의에는 라이프타임 인자가
명시되어야 합니다. 하지만 매번 라이프타임 인자를 함수 정의에 적기에는 매우
번거롭기 때문에, 자주 발생하는 몇 가지 경우에는 라이프타임을 생략할 수 있습니다.
이 규칙을 **라이프타임 생략 규칙**(lifetime elision rule)이라고 합니다.

**라이프타임 생략은 타입 유추의 결과가 아닙니다.** 앞뒤 문맥과 타입 정보에 따라
적절한 라이프타임을 찾는 타입 유추와는 달리, 함수 정의에서의 라이프타임 생략은
정해진 규칙에 따라 기계적으로만 적용됩니다.

## 입력 라이프타임, 출력 라이프타임
함수 정의에는 **입력 라이프타임**(input lifetime)과 **출력 라이프타임**(output
lifetime)이라는 개념이 있습니다. 용어에서 알 수 있듯이,

* 입력 라이프타임은 함수 인자 타입에 나타나는 라이프타임
* 출력 라이프타임은 함수 리턴 타입에 나타나는 라이프타임

을 의미합니다.

## 규칙
함수 정의에서 생략된 라이프타임에는 다음과 같은 규칙이 적용됩니다.

* 함수 인자에서 생략된 라이프타임은 각각 서로 다른 입력 라이프타임이 된다.

  ```rust
  fn foo(x: &i32) { }
  // becomes
  fn foo<'a>(x: &'a i32) { }
  ```

  ```rust
  fn bar(x: &i32, y: &u64) { }
  // becomes
  fn bar<'a, 'b>(x: &'a i32, y: &'b u64) { }
  ```

* 입력 라이프타임이 생략 여부와 상관없이 하나뿐이라면, 그 라이프타임이 모든 출력
라이프타임에 적용된다.

  ```rust
  fn foo(x: &i32) -> &i32 { x }
  // becomes
  fn foo<'a>(x: &'a i32) -> &'a i32 { x }
  ```

  ```rust
  fn bar<'a>(x: &'a str, y: &'a str) -> (&str, &str) { (x, y) }
  // becomes
  fn bar<'a>(x: &'a str, y: &'a str) -> (&'a str, &'a str) { (x, y) }
  ```

* 함수 인자 중에 `&self`나 `&mut self`가 있으면, 그 인자에 사용된 라이프타임이
모든 출력 라이프타임에 적용된다.

  ```rust
  fn my_foo(&self, x: &str) -> &Foo { &self.foo }
  // becomes
  fn my_foo<'a, 'b>(&'a self, x: &'b str) -> &'a Foo { &self.foo }
  ```

  ```rust
  fn my_bar(&mut self, x: &str) -> (&mut Foo, &Bar) { (&mut self.foo, &self.bar) }
  // becomes
  fn my_bar<'a, 'b>(&'a mut self, x: &'b str) -> (&'a mut Foo, &'a Bar) { (&mut self.foo, &self.bar) }
  ```

* 그 외의 경우에는 생략할 수 없다.

  ```rust
  fn error_foo(mine: &MyStruct, x: &str) -> &Foo { &mine.foo } // ILLEGAL
  ```
