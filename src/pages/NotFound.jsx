import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="flex flex-col items-center py-16 text-center sm:py-24">
        <p className="font-denistina text-[88px] leading-none text-[#1c1c1c] sm:text-[120px]">
          404
        </p>
        <h1 className="mt-2 font-sans text-[20px] font-medium text-[#1c1c1c] sm:text-[24px]">
          Страница не найдена
        </h1>
        <p className="mt-3 max-w-[420px] font-sans text-[14px] leading-[1.6] text-[#1c1c1c]/60 sm:text-[15px]">
          Возможно, страница была перемещена или её адрес введён неверно.
          Вернитесь на главную или загляните в каталог ароматов.
        </p>
        <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
          <Link to="/" className="site-btn-primary gap-2">
            На главную
          </Link>
          <Link to="/catalog" className="site-btn-outline gap-2">
            В каталог
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
