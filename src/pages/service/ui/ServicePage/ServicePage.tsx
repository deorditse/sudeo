import { useEffect, type CSSProperties } from "react";
import { Navigate, useParams } from "react-router-dom";
import { selectServiceBySlug } from "@pages/service/model";
import { MainContent } from "@shared/layouts/MainContent";
import { emitSafeEvent } from "@shared/lib/analytics";
import {
    AppButton,
    AppGrid,
    AppPadding,
    Box,
    Section,
    VStack,
} from "@shared/ui";
import {
    Arrow,
    Breadcrumbs,
    BulletPanel,
    Faq,
    SectionHeading,
} from "@shared/ui/SitePrimitives";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import * as cls from "./ServicePage.module.scss";

const ServicePage = () => {
    const { slug } = useParams();
    const service = selectServiceBySlug(slug);

    useEffect(() => {
        if (service) {
            emitSafeEvent("service_view", { service: service.slug });
        }
    }, [service]);

    if (!service) {
        return <Navigate to="/404" replace />;
    }

    const relatedCaseTitle = service.slug === "ai-agents"
        ? "Демонстрация агента по базе знаний"
        : "Кейсы будут опубликованы после согласования прав";
    const relatedCasePath = service.slug === "ai-agents"
        ? "/cases/knowledge-agent-demo"
        : "/cases";

    return (
        <Page>
            <AppPadding
                as="section"
                className={cls.serviceHero}
                style={{ "--service-accent": service.accent } as CSSProperties}
                pt="190"
                pb="105"
                mobilePt="145"
                mobilePb="75"
            >
                <MainContent>
                    <Breadcrumbs items={[["Услуги", "/services"], [service.title]]} />
                    <AppGrid
                        columns={2}
                        tabletColumns={2}
                        template="serviceHero"
                        mobileColumns={1}
                        gap="78"
                        align="center"
                    >
                        <VStack gap="24" align="start">
                            <p className={cls.eyebrow}>Направление {service.number}</p>
                            <h1>{service.title}</h1>
                            <p className={cls.serviceLead}>{service.short}</p>
                            <AppButton to="/contacts" addonRight={<Arrow />}>
                                Обсудить задачу
                            </AppButton>
                        </VStack>
                        <Box className={cls.serviceGlyph} aria-hidden="true">
                            <span>{service.number}</span>
                        </Box>
                    </AppGrid>
                </MainContent>
            </AppPadding>

            <Section>
                <MainContent>
                    <AppGrid columns={2} mobileColumns={1} gap="90" align="start">
                        <SectionHeading
                            eyebrow="Задача"
                            title="Когда это направление подходит"
                            text={service.problem}
                        />
                        <BulletPanel
                            title="Подходящие сценарии"
                            items={service.scenarios}
                        />
                    </AppGrid>
                </MainContent>
            </Section>

            <Section tone="dark">
                <MainContent>
                    <SectionHeading eyebrow="Состав" title="Что входит в работу" />
                    <AppGrid columns={5} tabletColumns={3} mobileColumns={1} gap="0" className={cls.stepsGrid}>
                        {service.scope.map((item, index) => (
                            <Box as="article" className={cls.stepItem} key={item}>
                                <span>0{index + 1}</span>
                                <h3>{item}</h3>
                            </Box>
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>

            <Section>
                <MainContent>
                    <AppGrid columns={2} mobileColumns={1} gap="90" align="start">
                        <BulletPanel title="Что передаём" items={service.deliverables} />
                        <BulletPanel
                            title="Что потребуется от клиента"
                            items={service.inputs}
                        />
                    </AppGrid>
                </MainContent>
            </Section>

            {service.aiControls && (
                <Section tone="accent">
                    <MainContent>
                        <SectionHeading
                            eyebrow="Контроль ИИ"
                            title="Автоматизация с ограничениями по умолчанию"
                        />
                        <AppGrid columns={4} tabletColumns={2} mobileColumns={1} gap="20">
                            {service.aiControls.map((item, index) => (
                                <Box as="article" className={cls.controlItem} key={item}>
                                    <span>{index + 1}</span>
                                    <p>{item}</p>
                                </Box>
                            ))}
                        </AppGrid>
                    </MainContent>
                </Section>
            )}

            <Section>
                <MainContent>
                    <AppGrid columns={2} mobileColumns={1} gap="90" align="start">
                        <SectionHeading
                            eyebrow="Оценка"
                            title="Что влияет на сроки и стоимость"
                            text="Конкретные значения появляются только после согласования объёма и рисков."
                        />
                        <BulletPanel title="Факторы оценки" items={service.factors} />
                    </AppGrid>
                </MainContent>
            </Section>

            <Section tone="feature">
                <MainContent>
                    <AppGrid columns={2} mobileColumns={1} gap="40" align="end">
                        <VStack gap="24" align="start">
                            <p className={cls.tag}>Связанный материал</p>
                            <h2 className={cls.relatedCaseTitle}>{relatedCaseTitle}</h2>
                        </VStack>
                        <Box className={cls.relatedCaseAction}>
                            <AppButton
                                variant="secondary"
                                to={relatedCasePath}
                                addonRight={<Arrow />}
                            >
                                Подробнее
                            </AppButton>
                        </Box>
                    </AppGrid>
                </MainContent>
            </Section>

            <Section>
                <MainContent width="narrow">
                    <SectionHeading
                        eyebrow="FAQ"
                        title={`Частые вопросы: ${service.title.toLowerCase()}`}
                    />
                    <Faq items={service.faq} />
                </MainContent>
            </Section>

            <Section tone="form">
                <MainContent>
                    <EnquiryForm initialService={service.slug} />
                </MainContent>
            </Section>
        </Page>
    );
};

export default ServicePage;
