import { selectPrivacyPageModel } from "@pages/privacy/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppPadding, AppText, Section, VStack } from "@shared/ui";
import { PageHero } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import styles from "../components/PrivacyDocument.module.scss";

const PrivacyPage = () => {
    const model = selectPrivacyPageModel();
    return (
        <Page>
            <PageHero
                eyebrow="Правовая информация"
                title="Обработка данных"
                text="Финальный документ зависит от юрисдикции, оператора данных, подключённых сервисов и утверждённого маршрута обращения."
            />
            <Section>
                <MainContent width="narrow">
                    <AppText tone="muted" size="s">
                        Обновлено: {model.updatedAt}
                    </AppText>
                    <AppPadding
                        as="article"
                        className={styles.document}
                        pt="8"
                        pb="40"
                    >
                        <VStack gap="64" align="stretch">
                            {model.sections.map((section) => (
                                <VStack
                                    as="section"
                                    gap="24"
                                    align="stretch"
                                    key={section.title}
                                >
                                    <AppText as="h2" size="l" weight="semibold">
                                        {section.title}
                                    </AppText>
                                    {section.paragraphs.map((paragraph) => (
                                        <AppText key={paragraph}>{paragraph}</AppText>
                                    ))}
                                    {section.items && (
                                        <ul>
                                            {section.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </VStack>
                            ))}
                        </VStack>
                    </AppPadding>
                </MainContent>
            </Section>
        </Page>
    );
};

export default PrivacyPage;
