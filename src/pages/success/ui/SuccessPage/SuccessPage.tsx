import { selectSuccessPageModel } from "@pages/success/model";
import { PageHero } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";

const SuccessPage = () => {
    const model = selectSuccessPageModel();
    return <Page><PageHero eyebrow={model.code} title={model.title} text={model.description} /></Page>;
};

export default SuccessPage;
