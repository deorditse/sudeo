import { useEffect, useId, useMemo, useRef, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { services, contactStatus } from "@/shared/content/siteContent";
import { DynamicModuleLoader, type DynamicReducersList } from "@/shared/lib/components";
import { emitSafeEvent } from "@/shared/lib/analytics";
import { AppButton, AppLink, AppText } from "@shared/ui";
import { Arrow } from "@/shared/ui/SitePrimitives";
import { enquiryFormActions, enquiryFormReducer, selectEnquiryForm, validateEnquiryForm, type EnquiryFormValues } from "./model";
import styles from "./EnquiryForm.module.scss";

const reducers: DynamicReducersList = { enquiryForm: enquiryFormReducer };

const EnquiryFormContent = ({ initialService = "" }: { initialService?: string }) => {
    const formId = useId();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { values, errors, status, message, started } = useSelector(selectEnquiryForm);
    const pendingRef = useRef(false);
    const endpoint = import.meta.env.VITE_LEAD_ENDPOINT?.trim();
    const selectOptions = useMemo(() => services.map((service) => ({ value: service.slug, label: service.title })), []);

    useEffect(() => {
        if (initialService) dispatch(enquiryFormActions.initializeService(initialService));
    }, [dispatch, initialService]);

    const update = (field: keyof EnquiryFormValues, value: string) => {
        dispatch(enquiryFormActions.setField({ field, value }));
        if (!started) {
            dispatch(enquiryFormActions.markStarted());
            emitSafeEvent("form_start", { page: location.pathname });
        }
    };

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(enquiryFormActions.setMessage(""));
        const nextErrors = validateEnquiryForm(values);

        if (Object.keys(nextErrors).length > 0) {
            dispatch(enquiryFormActions.setErrors(nextErrors));
            dispatch(enquiryFormActions.setStatus("error"));
            dispatch(enquiryFormActions.setMessage("Проверьте выделенные поля."));
            emitSafeEvent("form_error", { reason: "validation", page: location.pathname });
            return;
        }

        if (!endpoint) {
            dispatch(enquiryFormActions.setStatus("error"));
            dispatch(enquiryFormActions.setMessage(contactStatus.message));
            emitSafeEvent("form_error", { reason: "endpoint_unavailable", page: location.pathname });
            return;
        }

        if (pendingRef.current) return;
        pendingRef.current = true;
        dispatch(enquiryFormActions.setStatus("pending"));

        try {
            const params = new URLSearchParams(location.search);
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
                body: JSON.stringify({
                    ...values,
                    page: location.pathname,
                    submittedAt: new Date().toISOString(),
                    utm: {
                        source: params.get("utm_source"),
                        medium: params.get("utm_medium"),
                        campaign: params.get("utm_campaign"),
                    },
                }),
            });
            if (!response.ok) throw new Error("Lead endpoint rejected request");
            emitSafeEvent("form_success", { service: values.service, page: location.pathname });
            navigate("/success");
        } catch {
            pendingRef.current = false;
            dispatch(enquiryFormActions.setStatus("error"));
            dispatch(enquiryFormActions.setMessage("Не удалось надёжно сохранить обращение. Данные остались в форме — попробуйте позже."));
            emitSafeEvent("form_error", { reason: "delivery", page: location.pathname });
        }
    };

    return (
        <div className={styles.layout}>
            <div>
                <AppText className={styles.eyebrow} size="xs" weight="bold">Обсудить проект</AppText>
                <AppText className={styles.introTitle} as="h2" size="xl" weight="medium">Расскажите, что хотите изменить</AppText>
                <AppText className={styles.introText}>Мы не публикуем неподтверждённые сроки и цены. Сначала уточняем задачу, данные, интеграции и критерии результата.</AppText>
                <div className={styles.note}><span>!</span>{contactStatus.message}</div>
            </div>
            <form className={styles.form} onSubmit={submit} noValidate aria-describedby={`${formId}-status`}>
                <label>Как к вам обращаться<input value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${formId}-name-error` : undefined} autoComplete="name" />{errors.name && <small id={`${formId}-name-error`}>{errors.name}</small>}</label>
                <label>Один удобный контакт<input value={values.contact} onChange={(event) => update("contact", event.target.value)} aria-invalid={Boolean(errors.contact)} aria-describedby={errors.contact ? `${formId}-contact-error` : undefined} placeholder="Email, телефон или @username" autoComplete="email" />{errors.contact && <small id={`${formId}-contact-error`}>{errors.contact}</small>}</label>
                <label>Направление<select value={values.service} onChange={(event) => update("service", event.target.value)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? `${formId}-service-error` : undefined}><option value="">Выберите услугу</option>{selectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{errors.service && <small id={`${formId}-service-error`}>{errors.service}</small>}</label>
                <label>Что нужно сделать<textarea rows={5} value={values.task} onChange={(event) => update("task", event.target.value)} aria-invalid={Boolean(errors.task)} aria-describedby={errors.task ? `${formId}-task-error` : undefined} placeholder="Контекст, задача и ожидаемый результат" />{errors.task && <small id={`${formId}-task-error`}>{errors.task}</small>}</label>
                <div id={`${formId}-status`} className={styles.status} role="status" aria-live="polite">{message}</div>
                <AppButton type="submit" loading={status === "pending"} disabled={status === "pending" || !endpoint} addonRight={<Arrow />}>Отправить обращение</AppButton>
                <AppText className={styles.consent}>Отправка будет доступна после утверждения оператора данных и подключения защищённого обработчика. Подробнее — <AppLink to="/privacy">на правовой странице</AppLink>.</AppText>
            </form>
        </div>
    );
};

export const EnquiryForm = (props: { initialService?: string }) => (
    <DynamicModuleLoader reducers={reducers}>
        <EnquiryFormContent {...props} />
    </DynamicModuleLoader>
);
