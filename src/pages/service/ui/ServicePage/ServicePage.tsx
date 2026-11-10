import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { selectServiceBySlug } from "@pages/service/model";
import { MainContent } from "@shared/layouts/MainContent";
import { emitSafeEvent } from "@shared/lib/analytics";
import {
    AppButton,
    AppGrid,
    AppPadding,
    AppText,
    Arrow,
    Badge,
    Box,
    Breadcrumbs,
    BulletPanel,
    Section,
    SectionHeading,
    VStack,
} from "@shared/ui";
import { DetailHero } from "@widgets/DetailHero";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Faq } from "@widgets/Faq";
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
            <DetailHero
                accent={service.accent}
                before={<Breadcrumbs items={[["Услуги", "/services"], [service.title]]} />}
                eyebrow={`Направление ${service.number}`}
                title={service.title}
                description={service.short}
                actions={(
                    <AppButton to="/contacts" addonRight={<Arrow />}>
                        Обсудить задачу
                    </AppButton>
                )}
                visual={(
                    <Box className={cls.serviceGlyph} aria-hidden="true">
                        <span>{service.number}</span>
                    </Box>
                )}
            />

            <Section>
                <MainContent>
                    <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="90" align="start">
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
                    <AppGrid
                        as="ol"
                        columns={1}
                        tabletColumns={3}
                        desktopColumns={5}
                        gap="0"
                        className={cls.stepsGrid}
                        style={{ margin: 0, padding: 0 }}
                    >
                        {service.scope.map((item, index) => (
                            <Box as="li" className={cls.stepItem} key={item}>
                                <span>0{index + 1}</span>
                                <AppText as="h3" size="l" weight="semibold">{item}</AppText>
                            </Box>
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>

            <Section>
                <MainContent>
                    <SectionHeading
                        eyebrow="Результат"
                        title="Что передаём и что потребуется для старта"
                    />
                    <AppPadding pt="40">
                        <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="90" align="start">
                            <BulletPanel title="Что передаём" items={service.deliverables} />
                            <BulletPanel
                                title="Что потребуется от клиента"
                                items={service.inputs}
                            />
                        </AppGrid>
                    </AppPadding>
                </MainContent>
            </Section>

            {service.aiControls && (
                <Section tone="accent">
                    <MainContent>
                        <SectionHeading
                            eyebrow="Контроль ИИ"
                            title="Автоматизация с ограничениями по умолчанию"
                        />
                        <AppGrid
                            as="ol"
                            columns={1}
                            tabletColumns={2}
                            desktopColumns={4}
                            gap="20"
                            className={cls.controlsGrid}
                            style={{ margin: 0, padding: 0 }}
                        >
                            {service.aiControls.map((item, index) => (
                                <Box as="li" className={cls.controlItem} key={item}>
                                    <span>{index + 1}</span>
                                    <AppText>{item}</AppText>
                                </Box>
                            ))}
                        </AppGrid>
                    </MainContent>
                </Section>
            )}

            <Section>
                <MainContent>
                    <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="90" align="start">
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
                    <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="40" align="end">
                        <VStack gap="24" align="start">
                            <Badge tone="accent">Связанный материал</Badge>
                            <AppText className={cls.relatedCaseTitle} as="h2" size="xl" weight="medium">
                                {relatedCaseTitle}
                            </AppText>
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
