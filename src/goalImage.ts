export interface GoalImageData {
  target: string;
  required: string;
  assumption: string;
  host: string;
}

const FONT = "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";

/** 공유용 결과 이미지. 보유 자산과 월 적립금은 개인정보라 넣지 않는다. */
export function renderGoalImage(data: GoalImageData): Promise<Blob> {
  const size = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('이미지를 만들 수 없는 브라우저입니다.'));

  ctx.fillStyle = '#0a0d16';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#4f8cff';
  ctx.fillRect(0, 0, size, 16);

  const text = (value: string, y: number, px: number, color: string, weight = 400) => {
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    // 긴 금액도 잘리지 않도록 폭에 맞춰 글자 크기를 줄인다.
    let fontPx = px;
    do {
      ctx.font = `${weight} ${fontPx}px ${FONT}`;
      fontPx -= 2;
    } while (ctx.measureText(value).width > size - 120 && fontPx > 20);
    ctx.fillText(value, size / 2, y);
  };

  text('월배당 목표 계산기', 170, 42, '#8b92a5');
  text(`매달 ${data.target} 받으려면`, 370, 72, '#e6e9ef', 600);
  text(data.required, 560, 130, '#4ade80', 700);
  text('이 필요합니다', 670, 56, '#e6e9ef');
  text(data.assumption, 830, 34, '#8b92a5');
  text('입력한 가정에 따른 계산이며 투자 권유가 아닙니다', 890, 28, '#6b7184');
  text(data.host, 1000, 34, '#4f8cff', 600);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지 생성에 실패했습니다.'))),
      'image/png',
    );
  });
}
