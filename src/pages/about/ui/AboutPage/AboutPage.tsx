import { selectAboutPageModel } from "@pages/about/model";
import { workStages } from "@shared/content/siteContent";
import { MainContent } from "@shared/layouts/MainContent";
import { AppGrid, AppPadding, AppText, Box, Section } from "@shared/ui";
import { PageHero, SectionHeading } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import * as cls from "./AboutPage.module.scss";

const AboutPage = () => {
    const model = selectAboutPageModel();
    return (
    <Page>
        <PageHero eyebrow="О компании" title="Разработка и маркетинг в одном контуре" text="Помогаем бизнесу привлекать клиентов, развивать цифровые продукты и автоматизировать работу. Состав команды и роли уточняются под задачу." />
        <Section><MainContent><AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="18" className={cls.valuesGrid}>{model.values.map(({ number, title, text }) => <Box as="article" className={cls.valueCard} key={number}><span>{number}</span><h2>{title}</h2><p>{text}</p></Box>)}</AppGrid></MainContent></Section>
        <Section tone="dark"><MainContent><SectionHeading eyebrow="Роли" title="Кто отвечает за результат" /><AppGrid columns={1} tabletColumns={2} desktopColumns={2} className={cls.roleGrid}>{model.roles.map((role) => <AppPadding className={cls.role} p="28" key={role}>{role}</AppPadding>)}</AppGrid></MainContent></Section>
        <Section><MainContent><SectionHeading eyebrow="Процесс" title="От обращения до сопровождения" /><Box className={cls.stageList}>{workStages.map(([number, title, text]) => <AppGrid as="article" columns={1} tabletColumns={3} desktopColumns={3} gap="30" align="start" className={cls.stageItem} key={number}><span>{number}</span><AppText as="h3" size="l" weight="medium">{title}</AppText><p>{text}</p></AppGrid>)}</Box></MainContent></Section>
    </Page>
    );
};

export default AboutPage;
