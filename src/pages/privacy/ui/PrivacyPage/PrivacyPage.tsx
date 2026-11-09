import { selectPrivacyPageModel } from "@pages/privacy/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppText, Section } from "@shared/ui";
import { PageHero } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import styles from "../components/PrivacyDocument.module.scss";

const PrivacyPage = () => {
    const model = selectPrivacyPageModel();
    return (
    <Page>
        <PageHero eyebrow="Правовая информация" title="Обработка данных" text="Финальный документ зависит от юрисдикции, оператора данных, подключённых сервисов и утверждённого маршрута обращения." />
        <Section><MainContent width="narrow"><AppText tone="muted" size="s">Обновлено: {model.updatedAt}</AppText><div className={styles.document}>{model.sections.map((section) => <section key={section.title}><AppText as="h2" size="l" weight="semibold">{section.title}</AppText>{section.paragraphs.map((paragraph) => <AppText key={paragraph}>{paragraph}</AppText>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</section>)}</div></MainContent></Section>
    </Page>
    );
};

export default PrivacyPage;
