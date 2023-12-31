import * as Page from '../pages/index';
// base routes
const general = [
    { path: 'general/section', element: <Page.SectionList url='section' /> },
    { path: 'general/section/add', element: <Page.SectionForm label="Add New" /> },
    { path: 'general/section/edit/:id', element: <Page.SectionForm label="Edit" /> },
    { path: 'general/area', element: <Page.AreaList url="area" /> },
    { path: 'general/area/add', element: <Page.AreaForm label="Add New" /> },
    { path: 'general/area/edit/:id', element: <Page.AreaForm label="Edit" /> },
    { path: 'general/area-type', element: <Page.AreaTypeList url='areaType' /> },
    { path: 'general/area-type/add', element: <Page.AreaTypeForm label="Add New" /> },
    { path: 'general/area-type/edit/:id', element: <Page.AreaTypeForm label="Edit" /> },
    { path: 'general/equipment-type', element: <Page.EquipmentTypeList url='equipmentType' /> },
    { path: 'general/equipment-type/add', element: <Page.EquipmentTypeForm label="Add New" /> },
    { path: 'general/equipment-type/edit/:id', element: <Page.EquipmentTypeForm label="Edit" /> },
    { path: 'general/equipment', element: <Page.EquipmentList url="equipment" /> },
    { path: 'general/equipment/add', element: <Page.EquipmentForm label="Add New" /> },
    { path: 'general/equipment/edit/:id', element: <Page.EquipmentForm label="Edit" /> },
    { path: 'general/batch-type', element: <Page.BatchTypeList url="batchType" /> },
    { path: 'general/batch-type/add', element: <Page.BatchTypeForm label="Add New" /> },
    { path: 'general/batch-type/edit/:id', element: <Page.BatchTypeForm label="Edit" /> },
    { path: 'general/product-category', element: <Page.ProductCategoryList url="productCategory" /> },
    { path: 'general/product-category/add', element: <Page.ProductCategoryForm label="Add New" /> },
    { path: 'general/product-category/edit/:id', element: <Page.ProductCategoryForm label="Edit" /> },
    { path: 'general/client', element: <Page.ClientList /> },
    { path: 'general/client/add', element: <Page.ClientForm label="Add New" /> },
    { path: 'general/client/edit/:id', element: <Page.ClientForm label="Edit" /> },
    { path: 'general/batch-status', element: <Page.BatchStatusList /> },
    { path: 'general/batch-status/add', element: <Page.BatchStatusForm label="Add New" /> },
    { path: 'general/batch-status/edit/:id', element: <Page.BatchStatusForm label="Edit" /> },
    { path: 'general/product', element: <Page.ProductList /> },
    { path: 'general/product/add', element: <Page.ProductForm label="Add New" /> },
    { path: 'general/product/edit/:id', element: <Page.ProductForm label="Edit" /> },
]
const method = [
    { path: 'method/raw-data', element: <Page.RawDataList url="RawData" /> },
    { path: 'method/raw-data/add', element: <Page.RawDataForm label="Add New" /> },
    { path: 'method/raw-data/edit/:id', element: <Page.RawDataForm label="Edit" /> },
    { path: 'method/test-category', element: <Page.TestCategoryList url="TestCategory" /> },
    { path: 'method/test-category/add', element: <Page.TestCategoryForm label="Add New" /> },
    { path: 'method/test-category/edit/:id', element: <Page.TestCategoryForm label="Edit" /> },
    { path: 'method/test', element: <Page.TestList url="Tests" /> },
    { path: 'method/test/add', element: <Page.TestForm label="Add New" /> },
    { path: 'method/test/edit/:id', element: <Page.TestForm label="Edit" /> },
    { path: 'method/testing-method', element: <Page.TestingMethodList url="TestingMethod" /> },
    { path: 'method/testing-method/add', element: <Page.TestingMethodForm label="Add New" /> },
    { path: 'method/testing-method/edit/:id', element: <Page.TestingMethodForm label="Edit" /> },
]
const template = [
    { path: 'template/stage', element: <Page.StageList url='stage' /> },
    { path: 'template/stage/add', element: <Page.StageForm label="Add New" /> },
    { path: 'template/stage/edit/:id', element: <Page.StageForm label="Edit" /> },
    { path: 'template/unit-operation', element: <Page.UnitOperationList url="UnitOperation" /> },
    { path: 'template/unit-operation/add', element: <Page.UnitOperationForm label="Add New" /> },
    { path: 'template/unit-operation/edit/:id', element: <Page.UnitOperationForm label="Edit" /> },
    { path: 'template/step-category', element: <Page.StepCategoryList url="StepCategory" /> },
    { path: 'template/step-category/add', element: <Page.StepCategoryForm label="Add New" /> },
    { path: 'template/step-category/edit/:id', element: <Page.StepCategoryForm label="Edit" /> },
    { path: 'template/template-definition', element: <Page.TemplateDefinitionList url="TemplateDefinition" /> },
    { path: 'template/template-definition/add', element: <Page.TemplateDefinitionForm label="Add New" /> },
    { path: 'template/template-definition/edit/:id', element: <Page.TemplateDefinitionForm label="Edit" /> },
    { path: 'template/step', element: <Page.StepList url='Step' /> },
    { path: 'template/step/add', element: <Page.StepForm label="Add New" /> },
    { path: 'template/step/edit/:id', element: <Page.StepForm label="Edit" /> },
    { path: 'template/manufacturing-template/', element: <Page.ManufacturingTemplateList url="Template" /> },
    { path: 'template/manufacturing-template/add', element: <Page.TemplateDefinitionForm label="Add New" /> },
    { path: 'template/manufacturing-template/edit/:id', element: <Page.ManufacturingTemplateForm label="Edit" /> },
    { path: 'template/value-from-previous-step', element: <Page.ValueFromPreviousStep /> },
    { path: 'template/template-modification', element: <Page.TemplateModification /> },
    { path: 'template/value-from-previous-step-template-level-copy', element: <Page.TemplateLevelCopy /> },
]
const productmpr = [
    { path: 'product-mpr/assign-product-to-template', element: <Page.AssignProductList url="AssignProductToTemplate" /> },
    { path: 'product-mpr/assign-product-to-template/add', element: <Page.AssignProductForm label="Add New" /> },
    { path: 'product-mpr/assign-product-to-template/edit/:id', element: <Page.AssignProductForm label="Edit" /> },
    { path: 'product-mpr/master-formula', element: <Page.MasterFormulaList url="product" /> },
    { path: 'product-mpr/master-formula/add', element: <Page.MasterFormulaForm label="Add New"/> },
    { path: 'product-mpr/master-formula/edit', element: <Page.MasterFormulaForm label="Edit"/> },
    { path: 'product-mpr/ingredient-adjustment', element: <Page.IngredientAdjustmentList url="product" /> },
    { path: 'product-mpr/ingredient-adjustment/add', element: <Page.IngredientAdjustmentForm label="Add New"/> },
    { path: 'product-mpr/ingredient-adjustment/edit', element: <Page.IngredientAdjustmentForm label="Edit"/> },
    { path: 'product-mpr/line-clearance', element: <Page.LineClearanceList url="LineClearance" /> },
    { path: 'product-mpr/line-clearance/add', element: <Page.LineClearanceForm label="Add New" /> },
    { path: 'product-mpr/line-clearance/edit/:id', element: <Page.LineClearanceForm label="Edit" /> },
    { path: 'product-mpr/assign-area-types', element: <Page.AssignAreaTypesList url="product" /> },
    { path: 'product-mpr/assign-area-types/add', element: <Page.AssignAreaTypesForm label="Add New" /> },
    { path: 'product-mpr/assign-area-types/edit', element: <Page.AssignAreaTypesForm label="Edit" /> },
    { path: 'product-mpr/safety-instructions', element: <Page.SafetyInstructionList url="product" /> },
    { path: 'product-mpr/safety-instructions/add', element: <Page.SafetyInstructionForm label="Add New" /> },
    { path: 'product-mpr/safety-instructions/edit', element: <Page.SafetyInstructionForm label="Edit" /> },
    { path: 'product-mpr/assign-equipment-types', element: <Page.AssignEquipmentList url="product" /> },
    { path: 'product-mpr/assign-equipment-types/add', element: <Page.AssignEquipmentForm label="Add New" /> },
    { path: 'product-mpr/assign-equipment-types/edit', element: <Page.AssignEquipmentForm label="Edit" /> },
    { path: 'product-mpr/step-product-variable', element: <Page.ProductVariableList url="ProductVariable"/> },
    { path: 'product-mpr/step-product-variable/add', element: <Page.ProductVariableForm label="Add New"/> },
    { path: 'product-mpr/step-product-variable/edit', element: <Page.ProductVariableForm label="Edit" /> },
    { path: 'product-mpr/product-level-step-validation', element: <Page.ProductStepValidationList url="ProductLevelStepValidation"/> },
    { path: 'product-mpr/product-level-step-validation/add', element: <Page.ProductStepValidationForm label="Add New"/> },
    { path: 'product-mpr/product-level-step-validation/edit', element: <Page.ProductStepValidationForm label="Edit" /> },
    { path: 'product-mpr/product-level-copy', element: <Page.ProductLevelCopy /> },
    { path: 'product-mpr/mpr-generation', element: <Page.MprGenerationList url='ProductMPR'/> },
    { path: 'product-mpr/mpr-generation/add', element: <Page.MprGenerationForm label="Add New"/> },
    { path: 'product-mpr/mpr-generation/edit', element: <Page.MprGenerationForm label="Edit"/> },


]
const electronicSign = [
    { path: 'electronic-signature/:type', element: <Page.Esign /> },
]
const inquiry = [
    { path: 'inquiry/product-mpr-information', element: <Page.MprInfo /> },
]
// execution routes
const Baseroutes = [
    ...general, ...method, ...template, ...productmpr, ...electronicSign, ...inquiry,
    { path: '*', element: <Page.NotFound/> },
];
const transactions = [
    { path: 'transactions/assign-batch-no-for-product', element: <Page.AssignBatchList url="AssignBatchToProduct" /> },
    { path: 'transactions/assign-batch-no-for-product/add', element: <Page.AssignBatchForm label="Add New" /> },
    { path: 'transactions/assign-batch-no-for-product/edit', element: <Page.AssignBatchForm label="Edit" /> },
    { path: 'transactions/initiate-batch', element: <Page.InitiateBatchList url="InitiateBatch"/> },
    { path: 'transactions/initiate-batch/add', element: <Page.InitiateBatchForm label="Add New"/> },
    { path: 'transactions/initiate-batch/edit', element: <Page.InitiateBatchForm label='Edit'/> },
    { path: 'transactions/assign-material', element: <Page.AssignMaterialList url="AssignMaterial" /> },
    { path: 'transactions/assign-material/add', element: <Page.AssignMaterialForm label="Add New" /> },
    { path: 'transactions/assign-material/edit', element: <Page.AssignMaterialForm label='Edit' /> },
    { path: 'transactions/assign-areas', element: <Page.AssignAreaList url="AssignArea" /> },
    { path: 'transactions/assign-areas/add', element: <Page.AssignAreaForm label="Add New" /> },
    { path: 'transactions/assign-areas/edit', element: <Page.AssignAreaForm label="Edit" /> },
    { path: 'transactions/assign-equipment', element: <Page.AssignEquipmentExList url="AssignEquipment" /> },
    { path: 'transactions/assign-equipment/add', element: <Page.AssignEquipmentExForm label="Add New" /> },
    { path: 'transactions/assign-equipment/edit', element: <Page.AssignEquipmentExForm label="Edit" /> },
    { path: 'transactions/line-clearance', element: <Page.LineClearanceExList url="UnitOpLC" /> },
    { path: 'transactions/line-clearance/add', element: <Page.LineClearanceExForm label="Add New" /> },
    { path: 'transactions/line-clearance/edit', element: <Page.LineClearanceExForm label="Edit" /> },
    { path: 'transactions/ingredient-quality-adjustment', element: <Page.IngredientAdjustmentExList url="IngredientAdjCalc" /> },
    { path: 'transactions/ingredient-quality-adjustment/add', element: <Page.IngredientAdjustmentExForm label="Add New" /> },
    { path: 'transactions/ingredient-quality-adjustment/edit', element: <Page.IngredientAdjustmentExForm label="Edit" /> },
    { path: 'transactions/pharmacy-weighing', element: <Page.PharmacyWeighing label="pharmacy-weighing" /> },
    { path: 'transactions/manufacturing-execution', element: <Page.ManufacturingExecution label="manufacturing-execution" /> },
    { path: 'transactions/manufacturing-execution-demo', element: <Page.ManufacturingDemo label="manufacturing-demo" /> },
    { path: 'transactions/date-of-manufacturing-(DOM)', element: <Page.DOMList url="DateOfManufacturing" /> },
    { path: 'transactions/date-of-manufacturing-(DOM)/add', element: <Page.DOMForm label="Add New" /> },
    { path: 'transactions/date-of-manufacturing-(DOM)/edit', element: <Page.DOMForm label="Edit" /> },
    { path: 'transactions/document-upload-(Unit-Operation)', element: <Page.DocumentUploadList url="DocUploadUnitOp" /> },
    { path: 'transactions/document-upload-(Unit-Operation)/add', element: <Page.DocumentUploadForm label="Add New" /> },
    { path: 'transactions/document-upload-(Unit-Operation)/edit', element: <Page.DocumentUploadForm label="Edit" /> },
    { path: 'transactions/batch-event', element: <Page.BatchEventList url="BatchEvent" /> },
    { path: 'transactions/batch-event/add', element: <Page.BatchEventForm label="Add New" /> },
    { path: 'transactions/batch-event/edit', element: <Page.BatchEventForm label="Edit" /> },
    { path: 'transactions/batch-closure', element: <Page.BatchClosureList url="BatchClosure" /> },
    { path: 'transactions/batch-closure/add', element: <Page.BatchClosureForm label="Add New" /> },
    { path: 'transactions/batch-closure/edit', element: <Page.BatchClosureForm label="Edit" /> },
]
const deviation = [
    { path: 'deviation/add-step', element: <Page.AddStep label="add-step" /> },
    { path: 'deviation/remove-step', element: <Page.RemoveStepList url="DevRemoveStep" /> },
    { path: 'deviation/remove-step/add', element: <Page.RemoveStepForm label="Add New" /> },
    { path: 'deviation/remove-step/edit', element: <Page.RemoveStepForm label="Edit" /> },
    { path: 'deviation/change-ingredient', element: <Page.ChangeIngredient label="change-ingredient" /> },
    { path: 'deviation/change-ingredient-lot-no', element: <Page.ChangeIngredientLotNo label="change-ingredient-lot" /> },
    { path: 'deviation/pharmacy-weighing-removal', element: <Page.PharmacyWeighingRemoval label="pharmacy-weighing-removal" /> },

]
const listing = [
    { path: 'transactions/listing', element: <Page.Listing url="listing-transaction" /> },
]
const reports = [
    { path: 'report/batch-review', element: <Page.BatchReview url="batch-review" /> },
    { path: 'report/periodic-review', element: <Page.PeriodicReview label="periodic-review" /> },
]
const inquiryroutes = [
    { path: 'inquiry/mpr-inquiry', element: <Page.MprInquriy url="mpr-inquiry" /> },
    { path: 'inquiry/process-monitoring-inquiry', element: <Page.ProcessMonitoring label="process-monitoring" /> },
    { path: 'inquiry/batches-in-manufacturing-(status)', element: <Page.BatchesInManufacturing label="batches-in-manufacturing" /> },
]
const Executionroutes = [
    ...transactions,...deviation, ...listing, ...reports, ...inquiryroutes,
    { path: '*', element: <Page.NotFound/> },
]
export {
    Baseroutes,
    Executionroutes
}