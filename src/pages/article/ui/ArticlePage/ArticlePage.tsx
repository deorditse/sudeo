import { selectArticlePageModel } from "@pages/article/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppLink, AppText } from "@shared/ui";
import { Arrow, Breadcrumbs } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import styles from "./ArticlePage.module.scss";

const ArticlePage = () => {
    const model = selectArticlePageModel();
    return (
        <Page className={styles.page}>
            <article>
                <header className={styles.header}><MainContent width="narrow"><Breadcrumbs items={[["Блог", "/blog"], [model.title]]} /><AppText size="xs" weight="bold" uppercase>ИИ и автоматизация</AppText><AppText as="h1" size="2xl" weight="medium">{model.title}</AppText><AppText className={styles.meta}>{model.author} · {model.date} · 8 минут</AppText><AppText className={styles.lead}>{model.intro}</AppText></MainContent></header>
                <MainContent className={styles.body} width="narrow">{model.sections.map(([title, text]) => <section key={title}><AppText as="h2" size="xl" weight="medium">{title}</AppText><AppText>{text}</AppText></section>)}<aside className={styles.callout}><strong>Главный принцип</strong><AppText>Сначала ограниченный сценарий, данные и критерии. Затем — решение о полной реализации.</AppText><AppLink to="/services/ai-agents">Об ИИ-агентах <Arrow /></AppLink></aside></MainContent>
            </article>
        </Page>
    );
};

export default ArticlePage;
