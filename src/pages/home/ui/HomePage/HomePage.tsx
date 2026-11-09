import { selectHomePageModel } from "@pages/home/model";
import { MainContent } from "@shared/layouts/MainContent";
import {
    AppButton,
    AppGrid,
    AppLink,
    AppPadding,
    Box,
    HStack,
    Section,
    VStack,
} from "@shared/ui";
import {
    Arrow,
    Faq,
    SectionHeading,
    ServiceCard,
} from "@/shared/ui/SitePrimitives";
import { EnquiryForm } from "@widgets/EnquiryForm";
import { Page } from "@widgets/Page";
import { HeroMarquee } from "../components/HeroMarquee";
import { HeroOrbit } from "../components/HeroOrbit";
import * as cls from "./HomePage.module.scss";

const HomePage = () => {
    const model = selectHomePageModel();

    return (
        <Page>
            <AppPadding
                as="section"
                className={cls.hero}
                pt="180"
                pb="78"
                mobilePt="140"
            >
                <Box className={cls.heroGlow} aria-hidden="true" />
                <MainContent className={cls.heroContent}>
                    <VStack gap="24">
                        <p className={cls.eyebrow}>Цифровые решения для бизнеса</p>
                        <h1>
                            Создаём продукты.
                            <br />
                            <span>Автоматизируем</span> работу.
                            <br />
                            Помогаем расти.
                        </h1>
                        <p className={cls.heroText}>
                            От сайта и мобильного приложения до ИИ-агента и
                            продвижения — исследуем задачу, запускаем решение и
                            развиваем его по данным.
                        </p>
                    </VStack>
                    <AppPadding pt="42">
                        <HStack className={cls.heroActions} gap="32" align="center">
                            <AppButton to="/contacts" addonRight={<Arrow />}>
                                Обсудить проект
                            </AppButton>
                            <AppLink className={cls.textLink} to="/services">
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
                    <AppGrid columns={4} tabletColumns={2} mobileColumns={1} className={cls.taskGrid}>
                        {model.tasks.map((task, index) => (
                            <Box as="article" className={cls.taskItem} key={task}>
                                <span>0{index + 1}</span>
                                <h3>{task}</h3>
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
                    <AppGrid columns={2} mobileColumns={1} gap="18">
                        {model.services.map((service) => (
                            <ServiceCard key={service.slug} service={service} />
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>

            <Section tone="feature">
                <MainContent>
                    <AppGrid
                        columns={2}
                        tabletColumns={2}
                        template="hero"
                        mobileColumns={1}
                        gap="78"
                        align="center"
                    >
                        <VStack gap="24" align="start">
                            <p className={cls.tag}>Демонстрационный проект</p>
                            <h2 className={cls.caseTitle}>
                                Агент, который отвечает по базе знаний — и
                                знает, когда остановиться
                            </h2>
                            <p className={cls.caseText}>
                                {model.demo.task} Без вымышленных клиентских
                                результатов.
                            </p>
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
                    <VStack className={cls.stageList}>
                        {model.stages.map(([number, title, text]) => (
                            <AppPadding
                                as="article"
                                className={cls.stageItem}
                                py="30"
                                key={number}
                            >
                                <AppGrid
                                    className={cls.stageGrid}
                                    columns={3}
                                    mobileColumns={2}
                                    gap="30"
                                    align="start"
                                >
                                    <span>{number}</span>
                                    <h3>{title}</h3>
                                    <p>{text}</p>
                                </AppGrid>
                            </AppPadding>
                        ))}
                    </VStack>
                </MainContent>
            </Section>

            <Section tone="dark">
                <MainContent>
                    <AppGrid columns={2} mobileColumns={1} gap="90">
                        <SectionHeading
                            eyebrow="Команда"
                            title="Собираем роли вокруг результата"
                            text="Руководитель проекта, технический ответственный, дизайнер и маркетолог работают в одном контуре. До старта назначаем владельца каждого результата и проверяем загрузку."
                        />
                        <AppPadding pt="40">
                            <VStack className={cls.competencyList}>
                                {model.competencies.map((item) => (
                                    <HStack className={cls.competencyItem} gap="24" key={item}>
                                        <span>+</span>
                                        {item}
                                    </HStack>
                                ))}
                                <AppPadding pt="40">
                                    <AppLink className={cls.textLink} to="/about">
                                        Как мы работаем <Arrow />
                                    </AppLink>
                                </AppPadding>
                            </VStack>
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
                    <Faq items={[...model.faq]} />
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
