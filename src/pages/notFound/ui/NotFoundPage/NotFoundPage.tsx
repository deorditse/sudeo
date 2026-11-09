import { selectNotFoundPageModel } from "@pages/notFound/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppButton, AppText } from "@shared/ui";
import { Arrow } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import styles from "../components/NotFoundMessage.module.scss";

const NotFoundPage = () => {
    const model = selectNotFoundPageModel();
    return (
        <Page className={styles.root}>
            <MainContent><AppText className={styles.code}>{model.code}</AppText><AppText className={styles.title} as="h1" size="2xl" weight="medium">{model.title}</AppText><AppText className={styles.description}>{model.description}</AppText><AppButton to="/" addonRight={<Arrow />}>Вернуться на главную</AppButton></MainContent>
        </Page>
    );
};

export default NotFoundPage;
