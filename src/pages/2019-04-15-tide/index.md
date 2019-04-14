---
title: Rust 비동기 웹 프레임워크, Tide
keywords:
  - rust
---

[Tide]는 `futures` 0.3을 사용하는 Rust 비동기 웹 프레임워크입니다. 이
포스트에서는 여러분에게 Tide의 목적과 구조를 설명드리려고 합니다.

[Tide]: https://github.com/rustasync/tide

이 글에 있는 코드는 Tide와 `http-service` 저장소에서 가져와 적절히 수정한
것들입니다.

## Tide의 개발 목적
[Rocket], [Gotham], [Actix Web] 같은 충분히 좋은 웹 프레임워크가 있음에도
불구하고 새 프레임워크를 만드는 이유는, 이것을 만드는 과정에서 **비동기 웹
생태계의 전반적인 발전**을 도모하기 위해서입니다.

[Rocket]: https://rocket.rs/
[Gotham]: https://gotham.rs/
[Actix Web]: https://actix.rs/

- 크레이트 생태계를 전체적으로 보완하고 발전시킵니다.
- 크레이트 간의 호환성을 개선합니다. 예를 들어, 한 프레임워크를 기준으로 만든
  미들웨어를 다른 프레임워크에도 큰 수정 없이 사용할 수 있도록 합니다.
- Tide와 그것을 사용하는 어플리케이션 양쪽에서 매크로로 생성된 코드를 최소화해
  간결하고 이해하기 쉽도록 합니다.

## Tide의 코어 구조
Tide의 마스터 브랜치 기준으로, Tide의 중심에 있는 코어는 **라우터**,
**`Middleware` 트레이트**, **`Endpoint` 트레이트**로 이루어져 있습니다.

- **라우터**는 HTTP 메서드와 경로를 보고 해당 요청을 처리하는 엔드포인트로
  연결합니다.

  ```rust
    let mut app = tide::App::new(()); // App 내부에 라우터가 있음
    app.at("/echo_path/:path").get(echo_path);
  ```

  라우팅 테이블을 작성할 때 경로의 특정 부분을 인자로 받도록 지정할 수 있습니다.
  위의 예시에서는 `:path`가 그러한 인자가 되겠죠. 이 인자는 미들웨어 또는
  엔드포인트가 `Context`를 통해 필요할 때 접근할 수 있습니다.

  ```rust
    async fn echo_path(cx: Context<()>) -> String {
        let path: String = cx.param("path").unwrap();
        format!("Your path is: {}", path)
    }
  ```

- **`Middleware` 트레이트**는 미들웨어가 HTTP 서버 백엔드와 엔드포인트 사이에
  위치해, 요청과 응답을 가공하거나 엔드포인트에 추가 기능을 제공할 수 있도록
  통일된 인터페이스를 정의합니다.

  ```rust
    /// 남아 있는 미들웨어 체인을 감싸는 미들웨어입니다.
    pub trait Middleware<AppData>: 'static + Send + Sync {
        /// 비동기적으로 요청을 처리하고 응답을 반환합니다.
        fn handle<'a>(
            &'a self,
            cx: Context<AppData>,
            next: Next<'a, AppData>,
        ) -> FutureObj<'a, Response>;
    }
  ```

  이후 `Middleware` 트레이트를 구현하는 미들웨어는 `App`에 추가되어 요청을
  받아들이고 응답을 보내는 과정에 관여할 수 있게 됩니다. 예를 들어, 응답에
  임의의 HTTP 헤더를 추가하는 `DefaultHeaders`라는 미들웨어를 다음과 같이 추가할
  수 있습니다.

  ```rust
    app.middleware(
        DefaultHeaders::new()
            .header("X-Version", "1.0.0")
            .header("X-Server", "Tide"),
    );
  ```

- **`Endpoint` 트레이트**는 HTTP 요청이나 미들웨어의 데이터를 바탕으로
  어플리케이션 로직을 실행하고 응답을 할 수 있도록 하는 인터페이스를 정의합니다.

  ```rust
    /// Tide 엔드포인트입니다.
    ///
    /// 이 트레이트는 `Fn` 타입에 대해 자동으로 구현되기 때문에,
    /// Tide 유저가 직접 구현하는 경우는 별로 없습니다.
    pub trait Endpoint<AppData>: Send + Sync + 'static {
        /// `call`을 비동기 실행한 결과 타입입니다.
        type Fut: Future<Output = Response> + Send + 'static;
    
        /// 주어진 컨텍스트 아래에서 엔드포인트를 실행합니다.
        fn call(&self, cx: Context<AppData>) -> Self::Fut;
    }
  ```

  `Context`를 받아 응답을 내놓는 함수는 모두 `Endpoint`를 구현합니다. 이때
  응답은 `http::Response`를 직접 사용할 수도 있지만, `String`이나 `Vec<u8>`과
  같이 Tide의 `IntoResponse` 트레이트를 구현하는 타입을 사용할 수도 있습니다.

이 코어는 여러 웹 관련 크레이트를 직간접적으로 모아 만들어졌습니다.

- 비동기 프로그래밍의 핵심 크레이트인 [`futures` 0.3][futures-preview]
- HTTP 관련 타입들을 제공하는 [`http`]
- HTTP 경로 기반 라우팅을 처리하는 [`route-recognizer`]
- 요청 내용의 역직렬화와 응답의 직렬화를 담당하는 [Serde]

[futures-preview]: https://github.com/rust-lang-nursery/futures-rs
[`http`]: https://crates.io/crates/http
[`route-recognizer`]: https://crates.io/crates/route-recognizer
[Serde]: https://serde.rs/

## `http-service`
Tide의 코어에는 실제 서버를 열어 네트워크 통신을 수행하는 부분이 없습니다. 그
대신 애플리케이션을 요청을 받아 응답을 내놓는 서비스로 추상화한 뒤 그
인터페이스를 노출합니다. 이 인터페이스는 [`http-service`]라는 별도의 크레이트에
`HttpService` 트레이트로 정의되어 있습니다.

[`http-service`]: https://crates.io/crates/http-service

```rust
pub trait HttpService: Send + Sync + 'static {
    type Connection: Send + 'static;
    type ConnectionFuture: Send + 'static + TryFuture<Ok = Self::Connection>;
    type Fut: Send + 'static + TryFuture<Ok = Response>;

    /// 새 커넥션을 만들어 초기화합니다.
    fn connect(&self) -> Self::ConnectionFuture;

    /// 요청 한 개의 처리를 시작합니다.
    fn respond(&self, conn: &mut Self::Connection, req: Request) -> Self::Fut;
}
```

이 접근은 Tide가 특정 서버 구현에 묶이지 않고 유저가 원하는 구현을 가져다 쓸 수
있도록 해 줍니다. 실제 서버를 열 때는 이 `HttpService`를 구현하는 타입을 받아
네트워크와 연결하는 어댑터를 사용합니다. 지금은 두 개의 크레이트가 이러한
어댑터를 제공합니다.

- [Hyper]를 사용하는 [`http-service-hyper`]
- 네트워크 통신 없이 요청을 시뮬레이션할 수 있는 [`http-service-mock`]

[Hyper]: https://hyper.rs/
[`http-service-hyper`]: https://crates.io/crates/http-service-hyper
[`http-service-mock`]: https://crates.io/crates/http-service-mock

또 이런 구조는 Tide가 AWS Lambda와 같은 서버리스 환경에서 쓰이기 쉽게 합니다.
서버 백엔드와 통신하는 방법을 몰라도 되기 때문이죠. `HttpService`를 서버리스
환경에 맞춰 주는 어댑터만 있으면, Tide를 포함해 `HttpService`를 사용하는 모든 웹
프레임워크가 이것을 활용할 수 있게 됩니다.

이러한 접근이 실제 코드에서 어떤 형태로 나타나는지 살펴봅시다. 다음 코드는
Tide에서 제공하는 메서드인 `App::serve`의 내용입니다. 기본 feature인 `hyper`가
켜져 있을 때 컴파일되며, `http-service-hyper`를 사용함을 확인할 수 있습니다.

```rust
/// 주어진 주소에서 어플리케이션 서버를 엽니다.
///
/// 이 메서드를 호출한 스레드의 실행을 무기한으로 막습니다.
#[cfg(feature = "hyper")]
pub fn serve(self, addr: impl std::net::ToSocketAddrs) -> std::io::Result<()> {
    let addr = addr
        .to_socket_addrs()?
        .next()
        .ok_or(std::io::ErrorKind::InvalidInput)?;

    println!("Server is listening on: http://{}", addr);
    http_service_hyper::serve(self.into_http_service(), addr); // *
    Ok(())
}
```

이번에는 `http-service-mock`을 사용하는 코드를 살펴봅시다. 여기서는 가상의
테스트용 서버에 요청을 시뮬레이션하는 것을 볼 수 있습니다. `*`으로 표시한 서버를
여는 코드가 위에 있는 `App::serve`의 그것과 유사하다는 것이 보입니다.

```rust
let mut app = tide::App::new(());
app.at("/add_one/:num").get(add_one);
let mut server = make_server(app.into_http_service()).unwrap(); // *

let req = http::Request::get("/add_one/3")
    .body(Body::empty())
    .unwrap();
let res = server.simulate(req).unwrap();
assert_eq!(res.status(), 200);
let body = block_on(res.into_body().into_vec()).unwrap();
assert_eq!(&*body, &*b"4");
```

## 마치며
Tide는 이제 막 0.1을 눈앞에 두었고, 아직 발전의 여지가 많은 프레임워크입니다.
Rust 비동기 웹 개발의 발전에 관심이 있으신가요? 개발을 도와 주세요!

- Tide를 써 보고 [피드백을 남겨 주세요][issues]! 0.1이 퍼블리시되기 전까지는 Git
  저장소 버전을 쓰는 것을 추천드립니다.
- Tide 미들웨어를 만들어 주세요! 세션 관리, 인증 등 필요한 미들웨어는 많습니다.
- 시간이 된다면, 한국 시간대 기준 매주 금요일 오전 1시에 열리는 Async Ecosystem
  WG 회의에 참석해 주세요. [Rust 프로그래밍 언어 공식 Discord 서버][discord]의
  `#wg-net-web` 채널에서 진행됩니다.

[issues]: https://github.com/rustasync/tide/issues
[discord]: https://discord.gg/rust-lang
