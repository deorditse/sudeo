import { selectCasePageModel } from "@pages/case/model";
import { MainContent } from "@shared/layouts/MainContent";
import { AppGrid, AppPadding, Box, Section, VStack } from "@shared/ui";
import { Breadcrumbs } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import * as cls from "./CasePage.module.scss";

const CasePage = () => {
    const model = selectCasePageModel();
    return (
    <Page>
        <AppPadding as="section" pt="190" pb="105" mobilePt="145" mobilePb="75" className={cls.hero}><MainContent><Breadcrumbs items={[["Проекты", "/cases"], [model.title]]} /><p className={cls.tag}>{model.type}</p><AppPadding as="h1" pt="18" pb="28">{model.title}</AppPadding><p>{model.task}</p></MainContent></AppPadding>
        <Section><MainContent>
            <AppPadding pb="100" mobilePb="70"><AppGrid columns={3} mobileColumns={1} className={cls.facts}><AppPadding as={VStack} p="28" gap="12" className={cls.fact}><span>Тип</span><strong>Демонстрация</strong></AppPadding><AppPadding as={VStack} p="28" gap="12" className={cls.fact}><span>Роль</span><strong>Полный прототип сценария</strong></AppPadding><AppPadding as={VStack} p="28" gap="12" className={cls.fact}><span>Результат</span><strong>Без коммерческих метрик</strong></AppPadding></AppGrid></AppPadding>
            <AppGrid columns={2} mobileColumns={1} gap="64" className={cls.body}><VStack as="section"><h2>Исходные ограничения</h2><ul>{model.constraints.map((item) => <li key={item}>{item}</li>)}</ul></VStack><VStack as="section"><h2>Наша роль</h2><p>{model.role}</p><h2>Выполненные работы</h2><ul>{model.works.map((item) => <li key={item}>{item}</li>)}</ul></VStack></AppGrid>
            <AppPadding pt="100" mobilePt="70"><Box as="section" className={cls.result}><p className={cls.eyebrow}>Фактический результат</p><h2>{model.result}</h2><p>{model.period}</p></Box></AppPadding>
        </MainContent></Section>
    </Page>
    );
};

export default CasePage;
