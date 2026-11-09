import { selectBlogPageModel } from "@pages/blog/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppLink, AppText, Section } from "@shared/ui";
import { Arrow, PageHero } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import styles from "../components/ArticleCatalog.module.scss";

const BlogPage = () => {
    const { articles } = selectBlogPageModel();
    return (
    <Page>
        <PageHero eyebrow="Блог" title="Разбираем решения без технологического шума" text="Материалы о сценариях автоматизации, продуктовой разработке, стоимости решений и проверке маркетинговых гипотез." />
        <Section><MainContent>{articles.map((item) => <AppLink className={styles.card} key={item.title} to="/blog/how-to-start-ai-pilot"><span className={styles.meta}>ИИ и автоматизация · 8 минут</span><AppText className={styles.title} as="h2" size="xl" weight="medium">{item.title}</AppText><AppText className={styles.intro}>{item.intro}</AppText><strong className={styles.linkLabel}>Читать материал <Arrow /></strong></AppLink>)}</MainContent></Section>
    </Page>
    );
};

export default BlogPage;
