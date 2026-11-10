import { selectPrivacyPageModel } from "@pages/privacy/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppPadding, AppText, Prose, Section, VStack } from "@shared/ui";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";

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
                    <Prose as="article">
                        <AppPadding pt="8" pb="40">
                            <VStack gap="64" align="stretch">
                                {model.sections.map((section) => (
                                    <VStack
                                        as="section"
                                        align="stretch"
                                        key={section.title}
                                    >
                                        <h2>{section.title}</h2>
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph}>{paragraph}</p>
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
                    </Prose>
                </MainContent>
            </Section>
        </Page>
    );
};

export default PrivacyPage;
