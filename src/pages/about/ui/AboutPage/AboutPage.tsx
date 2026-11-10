import { selectAboutPageModel } from "@pages/about/model";
import { workStages } from "@shared/content/siteContent";
import { MainContent } from "@shared/layouts/MainContent";
import {
    AppGrid,
    AppPadding,
    AppText,
    Card,
    Section,
    SectionHeading,
} from "@shared/ui";
import { Page } from "@widgets/Page";
import { PageHero } from "@widgets/PageHero";
import { WorkStages, type WorkStage } from "@widgets/WorkStages";
import * as cls from "./AboutPage.module.scss";

const stages = workStages.map(
    ([number, title, description]): WorkStage => [number, title, description],
);

const AboutPage = () => {
    const model = selectAboutPageModel();

    return (
        <Page>
            <PageHero
                eyebrow="О компании"
                title="Разработка и маркетинг в одном контуре"
                text="Помогаем бизнесу привлекать клиентов, развивать цифровые продукты и автоматизировать работу. Состав команды и роли уточняются под задачу."
            />
            <Section>
                <MainContent>
                    <AppGrid
                        columns={1}
                        tabletColumns={2}
                        desktopColumns={2}
                        gap="18"
                    >
                        {model.values.map(({ number, title, text }) => (
                            <Card
                                as="article"
                                className={cls.valueCard}
                                key={number}
                            >
                                <AppText as="span" size="xs" tone="muted" weight="bold">
                                    {number}
                                </AppText>
                                <AppText
                                    as="h2"
                                    className={cls.valueTitle}
                                    size="xl"
                                    weight="medium"
                                >
                                    {title}
                                </AppText>
                                <AppText tone="muted">{text}</AppText>
                            </Card>
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>
            <Section tone="dark">
                <MainContent>
                    <SectionHeading
                        eyebrow="Роли"
                        title="Кто отвечает за результат"
                    />
                    <AppGrid
                        as="ul"
                        columns={1}
                        tabletColumns={2}
                        desktopColumns={2}
                        className={cls.roleGrid}
                        style={{ margin: 0, padding: 0 }}
                    >
                        {model.roles.map((role) => (
                            <AppPadding as="li" className={cls.role} p="28" key={role}>
                                <AppText tone="inverse">{role}</AppText>
                            </AppPadding>
                        ))}
                    </AppGrid>
                </MainContent>
            </Section>
            <Section>
                <MainContent>
                    <SectionHeading
                        eyebrow="Процесс"
                        title="От обращения до сопровождения"
                    />
                    <WorkStages stages={stages} />
                </MainContent>
            </Section>
        </Page>
    );
};

export default AboutPage;
