import { PageLayout } from '../components/PageLayout';

const CONTACT_EMAIL = 'aamoos@naver.com';

export function ContactPage() {
  return (
    <PageLayout
      title="문의하기"
      subtitle="사이트 관련 문의, 오류 신고, 콘텐츠 제안을 받습니다."
    >
      <section>
        <h2>이메일 문의</h2>
        <p>
          사이트 기능에 대한 의견, 버그 신고, 계산 로직 관련 문의, 기타 피드백이 있으시면
          아래 이메일로 연락 주세요.
        </p>
        <p>
          <b>문의 이메일</b>:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="muted">
          가능한 빠르게 확인 후 회신드리지만, 1인 운영으로 회신이 1~3일 정도 소요될 수
          있음을 양해 부탁드립니다.
        </p>
      </section>

      <section>
        <h2>문의 시 포함해 주시면 좋은 정보</h2>
        <ul>
          <li>이슈가 발생한 페이지 URL (예: <code>/guide</code>, <code>/</code> 등)</li>
          <li>사용 중인 브라우저와 기기 정보 (Chrome/PC, Safari/iPhone 등)</li>
          <li>재현 방법(가능하다면 스크린샷 첨부)</li>
          <li>입력한 시뮬레이션 파라미터 (계산 결과 관련 문의의 경우)</li>
        </ul>
      </section>

      <section>
        <h2>콘텐츠 제안 · 제휴 문의</h2>
        <p>
          새로 다뤘으면 하는 ETF·계산 시나리오·가이드 주제 제안이 있으시다면 언제든
          환영합니다. 다만 다음 유형의 문의는 <b>회신하지 않습니다</b>.
        </p>
        <ul>
          <li>특정 종목 매수·매도 추천 요청</li>
          <li>개인별 투자 자문, 세무 자문 요청</li>
          <li>스팸·광고·마케팅 대행 제안</li>
          <li>부적절한 외부 링크 게재 요청</li>
        </ul>
        <p>
          개별 투자·세무 판단은 반드시 금융·세무 전문가를 통해 확인하시기 바랍니다.
          자세한 내용은 <a href="/disclaimer">면책조항</a> 참조.
        </p>
      </section>

      <section>
        <h2>개인정보 관련 문의</h2>
        <p>
          본 사이트는 사용자 개인정보를 서버에 저장하지 않으며, 모든 입력값은 사용자의
          브라우저에만 저장됩니다. 개인정보 처리에 관한 자세한 사항은{' '}
          <a href="/privacy">개인정보처리방침</a>을 참고해 주세요.
        </p>
      </section>
    </PageLayout>
  );
}
