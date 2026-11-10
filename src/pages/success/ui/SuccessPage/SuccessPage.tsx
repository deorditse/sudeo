import { selectSuccessPageModel } from "@pages/success/model";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";

const SuccessPage = () => {
    const model = selectSuccessPageModel();

    return (
        <Page>
            <PageHero eyebrow={model.code} title={model.title} text={model.description} />
        </Page>
    );
};

export default SuccessPage;
