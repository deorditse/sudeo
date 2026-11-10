import { selectBlogPageModel } from "@pages/blog/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppText, Eyebrow, LinkCard, Section } from "@shared/ui";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";
import styles from "../components/ArticleCatalog.module.scss";

const BlogPage = () => {
    const { articles } = selectBlogPageModel();

    return (
        <Page>
            <PageHero
                eyebrow="Блог"
                title="Разбираем решения без технологического шума"
                text="Материалы о сценариях автоматизации, продуктовой разработке, стоимости решений и проверке маркетинговых гипотез."
            />
            <Section>
                <MainContent>
                    {articles.map((item) => (
                        <LinkCard
                            className={styles.card}
                            key={item.title}
                            to="/blog/how-to-start-ai-pilot"
                            tone="accent"
                            padding="spacious"
                        >
                            <Eyebrow>ИИ и автоматизация · 8 минут</Eyebrow>
                            <AppText className={styles.title} as="h2" size="xl" weight="medium">
                                {item.title}
                            </AppText>
                            <AppText className={styles.intro}>{item.intro}</AppText>
                            <AppText as="strong" weight="bold">
                                Читать материал <span aria-hidden="true">↗</span>
                            </AppText>
                        </LinkCard>
                    ))}
                </MainContent>
            </Section>
        </Page>
    );
};

export default BlogPage;
