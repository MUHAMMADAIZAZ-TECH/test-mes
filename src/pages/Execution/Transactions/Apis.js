import api from "../../../api/api";
// import { ERROR_MESSAGES } from "../../../../utils/constants";

export const fetchProducts = async (setstate) => {
    try {
        const response = await api.get("/ProductMPR");
        if (response.status === 200) {
            setstate(response.data)
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchProductBatches = async (page, setstate, prodcode) => {
    try {
        const response = await api.get(`/${page}/${prodcode}`);
        if (response.status === 200) {
            setstate(response.data)
        }
    } catch ({ response }) {
        console.error(response);
    }
}

export const fetchTemplateDetails = async (state, setstate) => {
    try {
        const response = await api.get(`/ProductMPR/TemplateDetail/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setstate(((prev) => ({ ...prev, Template: response.data })))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchIngredientAdjustmentOptions = async (state, setstate) => {
    try {
        const response = await api.get(`/ProductMPR/IngredientAdjustment/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            setstate(((prev) => ({ ...prev, IngAdjustOptions: response.data })))
        }
    } catch ({ response }) {
        console.error(response);
    }
}
export const fetchAssignBatchToProduct = async (state, batchNo, setState) => {
    try {
        const response = await api.get(`/AssignBatchToProduct/${state.sectionCode}/${state.prodcode}/${batchNo}`);
        if (response.status === 200) {
            setState((prev) => ({ ...prev, batchDetails: { ...response.data }, tempCode: response.data.template }))
        }
    } catch ({ response }) {
        console.error(response);
    }
}

export const fetchTheoriticalQTY = async (state) => {
    try {
        const response = await api.get(`/ProductMPR/TheoriticalQuantity/${state.sectionCode}/${state.prodcode}/${state.tempCode}`);
        if (response.status === 200) {
            return response.data
        }
    } catch ({ response }) {
        console.error(response);
    }
}