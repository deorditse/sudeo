import { selectContactsPageModel } from "@pages/contacts/model";
import { MainContent } from "@shared/layouts/MainContent";
import { Section } from "@shared/ui";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";

const ContactsPage = () => {
    const model = selectContactsPageModel();

    return (
        <Page>
            <PageHero
                eyebrow="Контакты"
                title="Начнём с задачи, а не с готового решения"
                text={`Опишите контекст и ожидаемый результат. ${model.responseTime}`}
            />
            <Section tone="form">
                <MainContent>
                    <EnquiryForm />
                </MainContent>
            </Section>
        </Page>
    );
};

export default ContactsPage;
