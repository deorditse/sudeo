import { selectCasePageModel } from "@pages/case/model";
import { MainContent } from "@shared/layouts/MainContent";
import {
    AppGrid,
    AppPadding,
    AppText,
    Badge,
    Breadcrumbs,
    Card,
    Eyebrow,
    Prose,
    Section,
    VStack,
} from "@shared/ui";
import { DetailHero } from "@widgets/DetailHero";
import { Page } from "@widgets/Page";
import * as cls from "./CasePage.module.scss";

const CasePage = () => {
    const model = selectCasePageModel();

    return (
        <Page>
            <DetailHero
                before={<Breadcrumbs items={[["Проекты", "/cases"], [model.title]]} />}
                eyebrow={<Badge tone="accent">{model.type}</Badge>}
                title={model.title}
                description={model.task}
            />
            <Section>
                <MainContent>
                    <AppPadding pb="70" tabletPb="100" desktopPb="100">
                        <AppGrid columns={1} tabletColumns={3} desktopColumns={3} className={cls.facts}>
                            <Card className={cls.fact} padding="compact">
                                <VStack gap="12">
                                    <AppText size="xs" tone="muted" weight="bold" uppercase>Тип</AppText>
                                    <strong>Демонстрация</strong>
                                </VStack>
                            </Card>
                            <Card className={cls.fact} padding="compact">
                                <VStack gap="12">
                                    <AppText size="xs" tone="muted" weight="bold" uppercase>Роль</AppText>
                                    <strong>Полный прототип сценария</strong>
                                </VStack>
                            </Card>
                            <Card className={cls.fact} padding="compact">
                                <VStack gap="12">
                                    <AppText size="xs" tone="muted" weight="bold" uppercase>Результат</AppText>
                                    <strong>Без коммерческих метрик</strong>
                                </VStack>
                            </Card>
                        </AppGrid>
                    </AppPadding>
                    <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="64">
                        <Prose as="section">
                            <h2>Исходные ограничения</h2>
                            <ul>{model.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
                        </Prose>
                        <Prose as="section" className={cls.role}>
                            <h2>Наша роль</h2>
                            <p>{model.role}</p>
                            <h2>Выполненные работы</h2>
                            <ul>{model.works.map((item) => <li key={item}>{item}</li>)}</ul>
                        </Prose>
                    </AppGrid>
                    <AppPadding pt="70" tabletPt="100" desktopPt="100">
                        <Card as="section" className={cls.result} tone="dark" padding="spacious">
                            <Eyebrow tone="inverse">Фактический результат</Eyebrow>
                            <AppText as="h2" size="xl" weight="medium">{model.result}</AppText>
                            <AppText>{model.period}</AppText>
                        </Card>
                    </AppPadding>
                </MainContent>
            </Section>
        </Page>
    );
};

export default CasePage;
