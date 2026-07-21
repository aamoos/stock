interface QA {
  q: string;
  a: string;
}

const HOME_FAQ: QA[] = [
  {
    q: '월배당 ETF란 무엇인가요?',
    a: '매월 분배금(배당)을 지급하도록 설계된 ETF입니다. QQQI·JEPQ·QYLD 같은 미국 상장 커버드콜 ETF나 TIGER 나스닥100 커버드콜 등 국내 상장 상품이 대표적입니다. 분기 배당 주식과 달리 매월 현금 흐름이 발생해 은퇴 소득이나 적립식 재투자에 활용됩니다.',
  },
  {
    q: '이 시뮬레이터는 무료인가요? 회원가입이 필요한가요?',
    a: '완전 무료이며 회원가입·로그인이 필요 없습니다. 입력한 모든 값은 서버가 아닌 사용자 브라우저(localStorage)에만 저장되므로 개인정보가 외부로 전송되지 않습니다.',
  },
  {
    q: '배당 재투자(DRIP)를 켜면 무엇이 달라지나요?',
    a: '매월 받은 세후 배당금으로 해당 종목을 다시 매수해 보유 수량이 늘어납니다. 시간이 지날수록 배당이 배당을 낳는 복리 효과가 커집니다. 설정에서 DRIP을 켜고/끄고 두 번 실행하면 10년·20년 뒤 차이를 직접 비교할 수 있습니다.',
  },
  {
    q: '일반계좌와 ISA계좌의 세금 차이는 어떻게 반영되나요?',
    a: '종목별로 계좌 유형(일반/ISA)과 배당세율을 따로 입력할 수 있습니다. 일반계좌는 보통 15.4%, ISA는 한도 내 비과세(0%)·초과분 9.9%를 참고값으로 사용합니다. 같은 ETF를 계좌만 다르게 두 개 넣으면 세후 수익 차이가 한눈에 보입니다.',
  },
  {
    q: '시뮬레이션 결과를 실제 수익으로 믿어도 되나요?',
    a: '아니요. 이 도구는 사용자가 입력한 가정(배당률·상승률·환율·세율)에 따른 수학적 계산일 뿐, 미래 수익을 보장하지 않습니다. 특히 커버드콜 ETF는 상승장에서 이익이 제한되고 장기적으로 NAV가 감소할 수 있어, 낙관·기본·보수 3가지 시나리오로 나눠 확인하는 것을 권장합니다.',
  },
];

export function HomeFaq() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="card faq-section home-faq">
      <h2>자주 묻는 질문 (FAQ)</h2>
      <dl className="faq-list">
        {HOME_FAQ.map((item, i) => (
          <div key={i} className="faq-item">
            <dt className="faq-question">{item.q}</dt>
            <dd className="faq-answer">{item.a}</dd>
          </div>
        ))}
      </dl>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
