import { selectNotFoundPageModel } from "@pages/notFound/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppButton, AppPadding, AppText, VStack } from "@shared/ui";
import { Page } from "@widgets/Page";
import styles from "../components/NotFoundMessage.module.scss";

const NotFoundPage = () => {
    const model = selectNotFoundPageModel();

    return (
        <Page className={styles.root}>
            <AppPadding
                as={VStack}
                className={styles.stage}
                align="stretch"
                justify="center"
                pt="145"
                pb="75"
                tabletPt="190"
                tabletPb="105"
                desktopPt="190"
                desktopPb="105"
            >
                <MainContent>
                    <VStack align="start">
                        <AppText className={styles.code}>{model.code}</AppText>
                        <AppPadding pt="18">
                            <AppText
                                className={styles.title}
                                as="h1"
                                size="2xl"
                                weight="medium"
                            >
                                {model.title}
                            </AppText>
                        </AppPadding>
                        <AppPadding pt="28">
                            <AppText className={styles.description}>
                                {model.description}
                            </AppText>
                        </AppPadding>
                        <AppPadding pt="36">
                            <AppButton to="/" addonRight={<span aria-hidden="true">↗</span>}>
                                Вернуться на главную
                            </AppButton>
                        </AppPadding>
                    </VStack>
                </MainContent>
            </AppPadding>
        </Page>
    );
};

export default NotFoundPage;
