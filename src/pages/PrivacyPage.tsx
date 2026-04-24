import { PageLayout } from '../components/PageLayout';

export function PrivacyPage() {
  return (
    <PageLayout
      title="개인정보처리방침"
      subtitle="본 서비스가 수집·이용하는 정보와 그 보호 방식에 대한 안내입니다."
    >
      <section>
        <h2>1. 개요</h2>
        <p>
          월배당 자산 시뮬레이터(이하 “서비스”)는 회원가입·로그인 절차 없이
          누구나 이용 가능한 정적 웹 도구입니다. 사용자의 이름, 이메일, 전화번호 등
          <b> 개인식별정보를 수집하거나 서버에 저장하지 않습니다.</b>
        </p>
      </section>

      <section>
        <h2>2. 수집하는 정보</h2>
        <h3>2.1 사용자가 입력한 시뮬레이션 데이터</h3>
        <p>
          보유 종목명, 수량, 가격, 배당률, 상승률, 세율, 시뮬레이션 기간 등
          사용자가 입력한 값은 사용자의 브라우저 내
          <b> localStorage에만 저장</b>되며, 외부 서버로 전송되지 않습니다.
        </p>
        <p>
          해당 데이터는 브라우저의 개발자 도구 또는 설정을 통해 언제든 직접 확인·삭제할 수 있으며,
          서비스 내 <b>⟲ 리셋 버튼</b>을 통해서도 일괄 삭제 가능합니다.
        </p>

        <h3>2.2 쿠키 및 광고 관련 정보</h3>
        <p>
          본 서비스는 Google AdSense를 통해 광고를 게재할 수 있으며, Google 및 제휴 광고사는
          사용자 방문 정보(IP 주소, 접속 디바이스 정보, 브라우저 정보, 방문 페이지, 체류 시간 등)를
          <b> 쿠키(Cookie) 또는 유사 기술</b>을 통해 수집할 수 있습니다.
        </p>
        <p>
          이렇게 수집된 정보는 Google의 관련 정책에 따라 개인화된 광고 제공에 활용됩니다.
        </p>

        <h3>2.3 접속 분석 (해당 시)</h3>
        <p>
          서비스 품질 개선을 위해 Vercel Analytics 등 익명화된 트래픽 통계 도구를 사용할 수 있으며,
          이 경우에도 개인 식별 정보는 수집하지 않습니다.
        </p>
      </section>

      <section>
        <h2>3. 제3자 정보 제공 · 광고</h2>
        <p>
          Google 및 제휴 광고 네트워크는 사용자 맞춤 광고를 위해 쿠키를 사용합니다.
          사용자는 다음 링크를 통해 개인 맞춤 광고를 거부하거나, 쿠키 설정을 변경할 수 있습니다.
        </p>
        <ul>
          <li>
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer noopener"
            >
              Google 광고 정책 (Google Ads Policies)
            </a>
          </li>
          <li>
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Google 광고 설정 (opt-out)
            </a>
          </li>
          <li>
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Digital Advertising Alliance (미국)
            </a>
          </li>
          <li>
            <a
              href="https://www.youronlinechoices.eu/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Your Online Choices (EU)
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>4. 쿠키 관리 방법</h2>
        <p>
          대부분의 브라우저는 쿠키 사용을 사용자가 제어할 수 있도록 설정 기능을 제공합니다.
          브라우저 설정에서 쿠키를 차단할 경우 일부 기능 이용에 제약이 있을 수 있습니다.
        </p>
      </section>

      <section>
        <h2>5. 보관 기간</h2>
        <p>
          사용자의 시뮬레이션 입력값은 사용자가 직접 삭제할 때까지 본인의 브라우저에만 보관됩니다.
          서비스 운영자는 해당 데이터에 접근할 수 없습니다.
        </p>
      </section>

      <section>
        <h2>6. 문의</h2>
        <p>
          본 개인정보처리방침에 관한 문의가 있으신 경우, 서비스 운영자의 배포 계정(GitHub/Vercel 등)을
          통해 연락해 주시기 바랍니다.
        </p>
      </section>

      <section>
        <h2>7. 변경</h2>
        <p>
          본 방침은 법령·서비스 변경에 따라 수정될 수 있으며, 변경 시 이 페이지에 공지합니다.
        </p>
        <p className="muted">
          최종 업데이트: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </section>
    </PageLayout>
  );
}
