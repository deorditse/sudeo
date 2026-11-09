import { selectAboutPageModel } from "@pages/about/model";
import { workStages } from "@shared/content/siteContent";
import { MainContent } from "@shared/layouts/MainContent";
import { Section } from "@shared/ui";
import { PageHero, SectionHeading } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import * as cls from "./AboutPage.module.scss";

const AboutPage = () => {
    const model = selectAboutPageModel();
    return (
    <Page>
        <PageHero eyebrow="О компании" title="Разработка и маркетинг в одном контуре" text="Помогаем бизнесу привлекать клиентов, развивать цифровые продукты и автоматизировать работу. Состав команды и роли уточняются под задачу." />
        <Section><MainContent><div className={cls.valuesGrid}>{model.values.map(({ number, title, text }) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></article>)}</div></MainContent></Section>
        <Section tone="dark"><MainContent><SectionHeading eyebrow="Роли" title="Кто отвечает за результат" /><div className={cls.roleGrid}>{model.roles.map((role) => <div key={role}>{role}</div>)}</div></MainContent></Section>
        <Section><MainContent><SectionHeading eyebrow="Процесс" title="От обращения до сопровождения" /><div className={cls.stageList}>{workStages.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></MainContent></Section>
    </Page>
    );
};

export default AboutPage;
