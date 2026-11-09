import { useEffect, type CSSProperties } from "react";
import { Navigate, useParams } from "react-router-dom";
import { selectServiceBySlug } from "@pages/service/model";
import { MainContent } from "@shared/layouts/MainContent";
import { emitSafeEvent } from "@/shared/lib/analytics";
import { AppButton, Section } from "@shared/ui";
import { Arrow, Breadcrumbs, BulletPanel, Faq, SectionHeading } from "@/shared/ui/SitePrimitives";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import * as cls from "./ServicePage.module.scss";

const ServicePage = () => {
    const { slug } = useParams();
    const service = selectServiceBySlug(slug);

    useEffect(() => {
        if (service) emitSafeEvent("service_view", { service: service.slug });
    }, [service]);

    if (!service) return <Navigate to="/404" replace />;

    return (
        <Page>
            <section className={cls.serviceHero} style={{ "--service-accent": service.accent } as CSSProperties}>
                <MainContent>
                    <Breadcrumbs items={[["Услуги", "/services"], [service.title]]} />
                    <div className={cls.serviceHeroGrid}>
                        <div><p className={cls.eyebrow}>Направление {service.number}</p><h1>{service.title}</h1><p>{service.short}</p><AppButton to="/contacts" addonRight={<Arrow />}>Обсудить задачу</AppButton></div>
                        <div className={cls.serviceGlyph} aria-hidden="true"><span>{service.number}</span></div>
                    </div>
                </MainContent>
            </section>
            <Section><MainContent><div className={cls.splitContent}><SectionHeading eyebrow="Задача" title="Когда это направление подходит" text={service.problem} /><BulletPanel title="Подходящие сценарии" items={service.scenarios} /></div></MainContent></Section>
            <Section tone="dark"><MainContent><SectionHeading eyebrow="Состав" title="Что входит в работу" /><div className={cls.stepsGrid}>{service.scope.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}</div></MainContent></Section>
            <Section><MainContent><div className={cls.twoColumns}><BulletPanel title="Что передаём" items={service.deliverables} /><BulletPanel title="Что потребуется от клиента" items={service.inputs} /></div></MainContent></Section>
            {service.aiControls && <Section tone="accent"><MainContent><SectionHeading eyebrow="Контроль ИИ" title="Автоматизация с ограничениями по умолчанию" /><div className={cls.controlGrid}>{service.aiControls.map((item, index) => <article key={item}><span>{index + 1}</span><p>{item}</p></article>)}</div></MainContent></Section>}
            <Section><MainContent><div className={cls.splitContent}><SectionHeading eyebrow="Оценка" title="Что влияет на сроки и стоимость" text="Конкретные значения появляются только после согласования объёма и рисков." /><BulletPanel title="Факторы оценки" items={service.factors} /></div></MainContent></Section>
            <Section tone="feature"><MainContent><div className={cls.relatedCase}><div><p className={cls.tag}>Связанный материал</p><h2>{service.slug === "ai-agents" ? "Демонстрация агента по базе знаний" : "Кейсы будут опубликованы после согласования прав"}</h2></div><AppButton variant="secondary" to={service.slug === "ai-agents" ? "/cases/knowledge-agent-demo" : "/cases"} addonRight={<Arrow />}>Подробнее</AppButton></div></MainContent></Section>
            <Section><MainContent width="narrow"><SectionHeading eyebrow="FAQ" title={`Частые вопросы: ${service.title.toLowerCase()}`} /><Faq items={service.faq} /></MainContent></Section>
            <Section tone="form"><MainContent><EnquiryForm initialService={service.slug} /></MainContent></Section>
        </Page>
    );
};

export default ServicePage;
