import { selectHomePageModel } from "@pages/home/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppButton, AppLink, Section } from "@shared/ui";
import { Arrow, Faq, SectionHeading, ServiceCard } from "@/shared/ui/SitePrimitives";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import * as cls from "./HomePage.module.scss";

const HomePage = () => {
    const model = selectHomePageModel();
    return (
    <Page>
        <section className={cls.hero}>
            <div className={cls.heroGlow} aria-hidden="true" />
            <MainContent className={cls.heroContent}>
                <p className={cls.eyebrow}>Цифровые решения для бизнеса</p>
                <h1>Создаём продукты.<br /><span>Автоматизируем</span> работу.<br />Помогаем расти.</h1>
                <p className={cls.heroText}>От сайта и мобильного приложения до ИИ-агента и продвижения — исследуем задачу, запускаем решение и развиваем его по данным.</p>
                <div className={cls.heroActions}>
                    <AppButton to="/contacts" addonRight={<Arrow />}>Обсудить проект</AppButton>
                    <AppLink className={cls.textLink} to="/services">Смотреть услуги <span aria-hidden="true">↓</span></AppLink>
                </div>
            </MainContent>
            <div className={cls.orbit} aria-hidden="true">
                <span className={cls.orbitCore}>S</span><i className={cls.orbitOne}>AI</i><i className={cls.orbitTwo}>WEB</i><i className={cls.orbitThree}>APP</i><i className={cls.orbitFour}>GROW</i>
            </div>
            <div className={cls.heroTicker} aria-hidden="true"><span>AI AGENTS</span><i /> <span>WEB DEVELOPMENT</span><i /> <span>MOBILE APPS</span><i /> <span>DIGITAL MARKETING</span></div>
        </section>
        <Section><MainContent>
            <SectionHeading eyebrow="Задачи" title="Не продаём технологии ради технологий" text="Начинаем с бизнес-задачи и выбираем подходящий формат решения." />
            <div className={cls.taskGrid}>{model.tasks.map((task, index) => <div className={cls.taskItem} key={task}><span>0{index + 1}</span><h3>{task}</h3></div>)}</div>
        </MainContent></Section>
        <Section tone="dark"><MainContent>
            <SectionHeading eyebrow="Направления" title="Одна команда — четыре компетенции" text="Закажите отдельную услугу или соберите полный цикл под задачу." />
            <div className={cls.serviceGrid}>{model.services.map((service) => <ServiceCard key={service.slug} service={service} />)}</div>
        </MainContent></Section>
        <Section tone="feature"><MainContent><div className={cls.casePanel}>
            <div><p className={cls.tag}>Демонстрационный проект</p><h2>Агент, который отвечает по базе знаний — и знает, когда остановиться</h2><p>{model.demo.task} Без вымышленных клиентских результатов.</p><AppButton variant="secondary" to="/cases/knowledge-agent-demo" addonRight={<Arrow />}>Посмотреть демонстрацию</AppButton></div>
            <div className={cls.demoVisual} aria-hidden="true"><div className={cls.chatBubble}>Как оформить возврат?</div><div className={cls.chatAnswer}><span>Источник: регламент 4.2</span><strong>Нашёл порядок действий и ограничения…</strong></div><div className={cls.confidence}><i /> Проверка источника</div></div>
        </div></MainContent></Section>
        <Section><MainContent><SectionHeading eyebrow="Процесс" title="Понятный маршрут от идеи до запуска" /><div className={cls.stageList}>{model.stages.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></MainContent></Section>
        <Section tone="dark"><MainContent><div className={cls.aboutGrid}>
            <SectionHeading eyebrow="Команда" title="Собираем роли вокруг результата" text="Руководитель проекта, технический ответственный, дизайнер и маркетолог работают в одном контуре. До старта назначаем владельца каждого результата и проверяем загрузку." />
            <div className={cls.competencyList}>{model.competencies.map((item) => <div key={item}><span>+</span>{item}</div>)}<AppLink className={cls.textLink} to="/about">Как мы работаем <Arrow /></AppLink></div>
        </div></MainContent></Section>
        <Section><MainContent width="narrow"><SectionHeading eyebrow="FAQ" title="Вопросы перед стартом" /><Faq items={[...model.faq]} /></MainContent></Section>
        <Section tone="form"><MainContent><EnquiryForm /></MainContent></Section>
    </Page>
    );
};

export default HomePage;
