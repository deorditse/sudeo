import { selectServicesPageModel } from "@pages/services/model";
import { MainContent } from "@shared/layouts/MainContent";
import { Section } from "@shared/ui";
import { PageHero, ServiceCard } from "@shared/ui/SitePrimitives";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import styles from "../components/ServicesCatalogSection.module.scss";

const ServicesPage = () => {
    const model = selectServicesPageModel();
    return (
    <Page>
        <PageHero eyebrow="Услуги" title="От первого исследования до работающего продукта" text="Подключаем нужные компетенции, фиксируем результат каждого этапа и не прячем внешние расходы внутри общей оценки." />
        <Section><MainContent><div className={styles.grid}>{model.services.map((service) => <ServiceCard key={service.slug} service={service} />)}</div></MainContent></Section>
        <Section tone="form"><MainContent><EnquiryForm /></MainContent></Section>
    </Page>
    );
};

export default ServicesPage;
