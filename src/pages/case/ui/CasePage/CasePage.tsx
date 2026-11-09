import { selectCasePageModel } from "@pages/case/model";
import { MainContent } from "@shared/layouts/MainContent";
import { Section } from "@shared/ui";
import { Breadcrumbs } from "@/shared/ui/SitePrimitives";
import { Page } from "@widgets/Page";
import * as cls from "./CasePage.module.scss";

const CasePage = () => {
    const model = selectCasePageModel();
    return (
    <Page>
        <section className={cls.hero}><MainContent><Breadcrumbs items={[["Проекты", "/cases"], [model.title]]} /><p className={cls.tag}>{model.type}</p><h1>{model.title}</h1><p>{model.task}</p></MainContent></section>
        <Section><MainContent>
            <div className={cls.facts}><div><span>Тип</span><strong>Демонстрация</strong></div><div><span>Роль</span><strong>Полный прототип сценария</strong></div><div><span>Результат</span><strong>Без коммерческих метрик</strong></div></div>
            <div className={cls.body}><div><h2>Исходные ограничения</h2><ul>{model.constraints.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h2>Наша роль</h2><p>{model.role}</p><h2>Выполненные работы</h2><ul>{model.works.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            <div className={cls.result}><p className={cls.eyebrow}>Фактический результат</p><h2>{model.result}</h2><p>{model.period}</p></div>
        </MainContent></Section>
    </Page>
    );
};

export default CasePage;
