// *****general*******//
export { default as AreaList } from "./Base/General/Area/List";
export { default as AreaForm } from "./Base/General/Area/Form";
export { default as AreaTypeList } from "./Base/General/AreaType/List";
export { default as AreaTypeForm } from "./Base/General/AreaType/Form";
export { default as SectionList } from "./Base/General/Section/List";
export { default as SectionForm } from "./Base/General/Section/Form";
export { default as EquipmentList } from "./Base/General/Equipment/List";
export { default as EquipmentForm } from "./Base/General/Equipment/Form";
export { default as EquipmentTypeList } from "./Base/General/EquipmentType/List";
export { default as EquipmentTypeForm } from "./Base/General/EquipmentType/Form";
export { default as BatchTypeList } from "./Base/General/BatchType/List";
export { default as BatchTypeForm } from "./Base/General/BatchType/Form";
export { default as ProductCategoryList } from "./Base/General/ProductCategory/List";
export { default as ProductCategoryForm } from "./Base/General/ProductCategory/Form";
export { default as ClientList } from "./Base/General/Client/List";
export { default as ClientForm } from "./Base/General/Client/Form";
export { default as BatchStatusList } from "./Base/General/BatchStatus/List";
export { default as BatchStatusForm } from "./Base/General/BatchStatus/Form";
export { default as ProductList } from "./Base/General/Product/List";
export { default as ProductForm } from "./Base/General/Product/Form";
// *****method*******//
export { default as RawDataList } from "./Base/Method/RawData/List";
export { default as RawDataForm } from "./Base/Method/RawData/Form";
export { default as TestCategoryList } from "./Base/Method/TestCategory/List";
export { default as TestCategoryForm } from "./Base/Method/TestCategory/Form";
export { default as TestList } from "./Base/Method/Test/List";
export { default as TestForm } from "./Base/Method/Test/Form";
export { default as TestingMethodList } from "./Base/Method/TestingMethod/List";
export { default as TestingMethodForm } from "./Base/Method/TestingMethod/Form";
// *****template *******//
export { default as StageList } from "./Base/Template/Stage/List";
export { default as StageForm } from "./Base/Template/Stage/Form";
export { default as UnitOperationList } from "./Base/Template/UnitOperation/List";
export { default as UnitOperationForm } from "./Base/Template/UnitOperation/Form";
export { default as StepCategoryList } from "./Base/Template/StepCategory/List";
export { default as StepCategoryForm } from "./Base/Template/StepCategory/Form";
export { default as TemplateDefinitionList } from "./Base/Template/TemplateDefination/List";
export { default as TemplateDefinitionForm } from "./Base/Template/TemplateDefination/Form";
export { default as StepList } from "./Base/Template/Step/List";
export { default as StepForm } from "./Base/Template/Step/Form";
export { default as ManufacturingTemplateList } from "./Base/Template/ManufacturingTemplate/List";
export { default as ManufacturingTemplateForm } from "./Base/Template/ManufacturingTemplate/Form";
export { default as ValueFromPreviousStep } from "./Base/Template/ValuefromPreviousStep/ValueFromPreviousStep";
export { default as TemplateModification } from "./Base/Template/TemplateModification/TemplateModification";
export { default as TemplateLevelCopy } from "./Base/Template/TemplateLevelCopy/TemplateLevelCopy";
// *****product *******//
export { default as AssignProductList } from "./Base/Product/AssignProductToTemplate/List";
export { default as AssignProductForm } from "./Base/Product/AssignProductToTemplate/Form";
export { default as MasterFormulaList } from "./Base/Product/MasterFormula/List";
export { default as MasterFormulaForm } from "./Base/Product/MasterFormula/Form";
export { default as SafetyInstructionList } from "./Base/Product/SafetyInstruction/List";
export { default as SafetyInstructionForm } from "./Base/Product/SafetyInstruction/Form";
export { default as AssignAreaTypesList } from "./Base/Product/AssignAreaTypes/List";
export { default as AssignAreaTypesForm } from "./Base/Product/AssignAreaTypes/Form";
export { default as IngredientAdjustmentList } from "./Base/Product/IngredientAdjustment/List";
export { default as IngredientAdjustmentForm } from "./Base/Product/IngredientAdjustment/Form";
export { default as LineClearanceList } from "./Base/Product/LineClearance/List";
export { default as LineClearanceForm } from "./Base/Product/LineClearance/Form";
export { default as AssignEquipmentList } from "./Base/Product/AssignEquipment/List";
export { default as AssignEquipmentForm } from "./Base/Product/AssignEquipment/Form";
export { default as ProductVariableList } from "./Base/Product/StepProductVariable/List";
export { default as ProductVariableForm } from "./Base/Product/StepProductVariable/Form";
export { default as ProductStepValidationList } from "./Base/Product/ProductStepValidation/List";
export { default as ProductStepValidationForm } from "./Base/Product/ProductStepValidation/Form";
export { default as MprGenerationList } from "./Base/Product/MprGeneration/List";
export { default as MprGenerationForm } from "./Base/Product/MprGeneration/Form";
export { default as ProductLevelCopy } from "./Base/Product/ProductLevelCopy/ProductCopy";
export { default as Esign } from "./Base/ElectronicSignature/Esign";
export { default as MprInfo } from "./Base/Inquiry/MprInfo";

// *************** transactions ******************* //
export { default as AssignBatchList } from "./Execution/Transactions/AssignBatch/List";
export { default as AssignBatchForm } from "./Execution/Transactions/AssignBatch/Form";
export { default as InitiateBatchList } from "./Execution/Transactions/InitiateBatch/List";
export { default as InitiateBatchForm } from "./Execution/Transactions/InitiateBatch/Form";
export { default as AssignMaterialList } from "./Execution/Transactions/AssignMaterial/List";
export { default as AssignMaterialForm } from "./Execution/Transactions/AssignMaterial/Form";
export { default as AssignAreaList } from "./Execution/Transactions/AssignArea/List";
export { default as AssignAreaForm } from "./Execution/Transactions/AssignArea/Form";
export { default as AssignEquipmentExList } from "./Execution/Transactions/AssignEquipment/List";
export { default as AssignEquipmentExForm } from "./Execution/Transactions/AssignEquipment/Form";
export { default as LineClearanceExList } from "./Execution/Transactions/LineClearance/List";
export { default as LineClearanceExForm } from "./Execution/Transactions/LineClearance/Form";
export { default as IngredientAdjustmentExList } from "./Execution/Transactions/IngredientAdjustment/List";
export { default as IngredientAdjustmentExForm } from "./Execution/Transactions/IngredientAdjustment/Form";
export { default as PharmacyWeighing } from "./Execution/Transactions/PharmacyWeighing/PharmacyWeighing";
export { default as ManufacturingExecution } from "./Execution/Transactions/ManufacturingExecution/ManufacturingExecution";
export { default as ManufacturingDemo } from "./Execution/Transactions/ManufacturingDemo/ManufacturingDemo";
export { default as DOMList } from "./Execution/Transactions/DateOfManufacturing/List";
export { default as DOMForm } from "./Execution/Transactions/DateOfManufacturing/Form";
export { default as DocumentUploadList } from "./Execution/Transactions/DocumentUpload/List";
export { default as DocumentUploadForm } from "./Execution/Transactions/DocumentUpload/Form";
export { default as BatchEventList } from "./Execution/Transactions/BatchEvent/List";
export { default as BatchEventForm } from "./Execution/Transactions/BatchEvent/Form";
export { default as BatchClosureList } from "./Execution/Transactions/BatchClosure/List";
export { default as BatchClosureForm } from "./Execution/Transactions/BatchClosure/Form";

//  **************** Deviation ******************* //
export { default as AddStep } from "./Execution/Deviation/Step/AddStep";
export { default as RemoveStepList } from "./Execution/Deviation/Step/List";
export { default as RemoveStepForm } from "./Execution/Deviation/Step/RemoveStep";
export { default as PharmacyWeighingRemoval } from "./Execution/Deviation/Pharmacy/PharmacyWeighingRemoval";
export { default as ChangeIngredient } from "./Execution/Deviation/Ingredient/ChangeIngredient";
export { default as ChangeIngredientLotNo } from "./Execution/Deviation/Ingredient/ChangeIngredientLotNo";
//  **************** Listing ******************** //
export { default as Listing } from "./Execution/Listing/Listing";
//  **************** Reports ******************* //
export { default as BatchReview } from "./Execution/Reports/BatchReview/BatchReview";
export { default as PeriodicReview } from "./Execution/Reports/PeriodicReview/PeriodicReview";
//  *************** Inquiry ******************** //
export { default as MprInquriy } from "./Execution/Inquiry/MprInquiry/MprInquriy";
export { default as ProcessMonitoring } from "./Execution/Inquiry/ProcessMonitoring/ProcessMonitoring";
export { default as BatchesInManufacturing } from "./Execution/Inquiry/BatchesInManufacturing/BatchesInManufacturing";
// *******others**********//
export { default as Connection } from "./Others/Connection";
export { default as NotFound } from "./Others/NotFound";
