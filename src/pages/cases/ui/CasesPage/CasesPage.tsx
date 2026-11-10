import { selectCasesPageModel } from "@pages/cases/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppGrid, AppText, Box, LinkCard, Section } from "@shared/ui";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";
import styles from "../components/CasesCatalog.module.scss";

const CasesPage = () => {
    const { cases } = selectCasesPageModel();

    return (
        <Page>
            <PageHero
                eyebrow="Проекты"
                title="Показываем только то, что можно подтвердить"
                text="Пока клиентские публикации согласуются, размещаем демонстрационные проекты с явной маркировкой и без вымышленных показателей."
            />
            <Section>
                <MainContent>
                    {cases.map((item) => (
                        <LinkCard
                            className={styles.card}
                            key={item.title}
                            to="/cases/knowledge-agent-demo"
                            padding="spacious"
                        >
                            <AppGrid columns={1} tabletColumns={2} desktopColumns={2} align="end">
                                <Box>
                                    <AppText size="xs" weight="bold" uppercase>
                                        Демонстрационный проект
                                    </AppText>
                                    <AppText className={styles.title} as="h2" size="xl" weight="medium">
                                        {item.title}
                                    </AppText>
                                    <AppText className={styles.description} tone="muted">
                                        {item.task}
                                    </AppText>
                                </Box>
                                <span className={styles.arrow} aria-hidden="true">↗</span>
                            </AppGrid>
                        </LinkCard>
                    ))}
                </MainContent>
            </Section>
        </Page>
    );
};

export default CasesPage;
