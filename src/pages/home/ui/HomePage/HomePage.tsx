import { selectHomePageModel } from "@pages/home/model";
import { MainContent } from "@shared/layouts/MainContent";
import {
    AppButton,
    AppGrid,
    AppLink,
    AppPadding,
    AppText,
    Arrow,
    Badge,
    Box,
    Eyebrow,
    HStack,
    Section,
    SectionHeading,
    VStack,
} from "@shared/ui";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Faq } from "@widgets/Faq";
import { Page } from "@widgets/Page";
import { ServiceCatalog } from "@widgets/ServiceCatalog";
import { WorkStages, type WorkStage } from "@widgets/WorkStages";
import { HeroMarquee } from "../components/HeroMarquee";
import { HeroOrbit } from "../components/HeroOrbit";
import * as cls from "./HomePage.module.scss";

const HomePage = () => {
    const model = selectHomePageModel();
    const stages = model.stages.map(
        ([number, title, description]): WorkStage => [number, title, description],
    );

    return (
        <Page>
            <AppPadding
                as="section"
                className={cls.hero}
                pt="140"
                pb="78"
                tabletPt="180"
                desktopPt="180"
            >
                <Box className={cls.heroGlow} aria-hidden="true" />
                <MainContent className={cls.heroContent}>
                    <VStack gap="24">
                        <Eyebrow tone="inverse">Цифровые решения для бизнеса</Eyebrow>
                        <h1>
                            Создаём продукты.
                            <br />
                            <span>Автоматизируем</span> работу.
                            <br />
                            Помогаем расти.
                        </h1>
                        <AppText className={cls.heroText} tone="inverse">
                            От сайта и мобильного приложения до ИИ-агента и
                            продвижения — исследуем задачу, запускаем решение и
                            развиваем его по данным.
                        </AppText>
                    </VStack>
                    <AppPadding pt="42">
                        <HStack className={cls.heroActions} gap="32" align="center">
                            <AppButton to="/contacts" addonRight={<Arrow />}>
                                Обсудить проект
                            </AppButton>
                            <AppLink
                                className={cls.heroSecondaryLink}
                                to="/services"
                                variant="action"
                            >
                                Смотреть услуги <span aria-hidden="true">↓</span>
                            </AppLink>
                        </HStack>
                    </AppPadding>
                </MainContent>
                <HeroOrbit identities={model.heroIdentities} />
                <HeroMarquee items={model.heroServices} />
            </AppPadding>

            <Section>
                <MainContent>
                    <SectionHeading
                        eyebrow="Задачи"
                        title="Не продаём технологии ради технологий"
                        text="Начинаем с бизнес-задачи и выбираем подходящий формат решения."
                    />
                    <AppGrid
                        as="ul"
                        columns={1}
                        tabletColumns={2}
                        desktopColumns={4}
                        className={cls.taskGrid}
                        style={{ margin: 0, padding: 0 }}
                    >
                        {model.tasks.map((task, index) => (
                            <Box as="li" className={cls.taskItem} key={task}>
                                <AppText as="span" size="xs" tone="muted" weight="bold">
                                    0{index + 1}
                                </AppText>
                                <AppText as="h3" size="l" weight="medium">
                                    {task}
                                </AppText>
                            </Box>
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>

            <Section tone="dark">
                <MainContent>
                    <SectionHeading
                        eyebrow="Направления"
                        title="Одна команда — четыре компетенции"
                        text="Закажите отдельную услугу или соберите полный цикл под задачу."
                    />
                    <ServiceCatalog services={model.services} />
                </MainContent>
            </Section>

            <Section tone="feature">
                <MainContent>
                    <AppGrid
                        columns={1}
                        tabletColumns={2}
                        desktopColumns={2}
                        template="hero"
                        gap="78"
                        align="center"
                    >
                        <VStack gap="24" align="start">
                            <Badge tone="accent">Демонстрационный проект</Badge>
                            <AppText
                                as="h2"
                                className={cls.caseTitle}
                                size="2xl"
                                weight="medium"
                            >
                                Агент, который отвечает по базе знаний — и
                                знает, когда остановиться
                            </AppText>
                            <AppText className={cls.caseText} tone="inverse">
                                {model.demo.task} Без вымышленных клиентских
                                результатов.
                            </AppText>
                            <AppButton
                                variant="secondary"
                                to="/cases/knowledge-agent-demo"
                                addonRight={<Arrow />}
                            >
                                Посмотреть демонстрацию
                            </AppButton>
                        </VStack>
                        <VStack className={cls.demoVisual} gap="24" aria-hidden="true">
                            <Box className={cls.chatBubble}>Как оформить возврат?</Box>
                            <Box className={cls.chatAnswer}>
                                <span>Источник: регламент 4.2</span>
                                <strong>
                                    Нашёл порядок действий и ограничения…
                                </strong>
                            </Box>
                            <HStack className={cls.confidence} gap="12" align="center">
                                <i /> Проверка источника
                            </HStack>
                        </VStack>
                    </AppGrid>
                </MainContent>
            </Section>

            <Section>
                <MainContent>
                    <SectionHeading
                        eyebrow="Процесс"
                        title="Понятный маршрут от идеи до запуска"
                    />
                    <WorkStages stages={stages} />
                </MainContent>
            </Section>

            <Section tone="dark">
                <MainContent>
                    <AppGrid columns={1} tabletColumns={2} desktopColumns={2} gap="90">
                        <SectionHeading
                            eyebrow="Команда"
                            title="Собираем роли вокруг результата"
                            text="Руководитель проекта, технический ответственный, дизайнер и маркетолог работают в одном контуре. До старта назначаем владельца каждого результата и проверяем загрузку."
                        />
                        <AppPadding pt="40">
                            <VStack
                                as="ul"
                                className={cls.competencyList}
                                style={{ margin: 0, padding: 0 }}
                            >
                                {model.competencies.map((item) => (
                                    <HStack
                                        as="li"
                                        className={cls.competencyItem}
                                        gap="24"
                                        key={item}
                                    >
                                        <span aria-hidden="true">+</span>
                                        {item}
                                    </HStack>
                                ))}
                            </VStack>
                            <AppPadding pt="40">
                                <AppLink to="/about" variant="action">
                                    Как мы работаем <Arrow />
                                </AppLink>
                            </AppPadding>
                        </AppPadding>
                    </AppGrid>
                </MainContent>
            </Section>

            <Section>
                <MainContent width="narrow">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Вопросы перед стартом"
                    />
                    <Faq items={model.faq} />
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

export default HomePage;
