import { selectArticlePageModel } from "@pages/article/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppLink, AppPadding, AppText, Box, Breadcrumbs, Prose, VStack } from "@shared/ui";
import { Page } from "@widgets/Page";
import styles from "./ArticlePage.module.scss";

const ArticlePage = () => {
    const model = selectArticlePageModel();

    return (
        <Page className={styles.page}>
            <Box as="article">
                <AppPadding
                    as="header"
                    pt="145"
                    pb="75"
                    tabletPt="190"
                    tabletPb="90"
                    desktopPt="190"
                    desktopPb="90"
                    className={styles.header}
                >
                    <MainContent width="narrow">
                        <Breadcrumbs items={[["Блог", "/blog"], [model.title]]} />
                        <AppText size="xs" weight="bold" uppercase>ИИ и автоматизация</AppText>
                        <AppText as="h1" size="2xl" weight="medium">{model.title}</AppText>
                        <AppText className={styles.meta}>{model.author} · {model.date} · 8 минут</AppText>
                        <AppText className={styles.lead}>{model.intro}</AppText>
                    </MainContent>
                </AppPadding>
                <MainContent width="narrow">
                    <AppPadding py="70" tabletPy="100" desktopPy="100">
                        <Prose>
                            {model.sections.map(([title, text]) => (
                                <AppPadding as={VStack} pb="70" key={title}>
                                    <h2>{title}</h2>
                                    <p>{text}</p>
                                </AppPadding>
                            ))}
                        </Prose>
                        <AppPadding pt="90">
                            <AppPadding
                                as="aside"
                                p="24"
                                tabletP="40"
                                desktopP="40"
                                className={styles.callout}
                            >
                                <strong>Главный принцип</strong>
                                <AppText>
                                    Сначала ограниченный сценарий, данные и критерии. Затем — решение о полной реализации.
                                </AppText>
                                <AppLink to="/services/ai-agents" variant="action">
                                    Об ИИ-агентах <span aria-hidden="true">↗</span>
                                </AppLink>
                            </AppPadding>
                        </AppPadding>
                    </AppPadding>
                </MainContent>
            </Box>
        </Page>
    );
};

export default ArticlePage;
