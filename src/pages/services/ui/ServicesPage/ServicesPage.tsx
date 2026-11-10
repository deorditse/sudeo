import { selectServicesPageModel } from "@pages/services/model";
import { MainContent } from "@shared/layouts/MainContent";
import { Section, SectionHeading } from "@shared/ui";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";
import { ServiceCatalog } from "@widgets/ServiceCatalog";

const ServicesPage = () => {
    const model = selectServicesPageModel();

    return (
        <Page>
            <PageHero
                eyebrow="Услуги"
                title="От первого исследования до работающего продукта"
                text="Подключаем нужные компетенции, фиксируем результат каждого этапа и не прячем внешние расходы внутри общей оценки."
            />
            <Section>
                <MainContent>
                    <SectionHeading
                        eyebrow="Каталог"
                        title="Направления работы"
                    />
                    <ServiceCatalog services={model.services} headingLevel="h3" />
                </MainContent>
            </Section>
            <Section tone="form">
                <MainContent>
                    <EnquiryForm />
                </MainContent>
            </Section>
        </Page>
    );
};

export default ServicesPage;
