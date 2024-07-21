import React from "react";
import { ShowFormStepsProps } from ".";
import { Button, Form, Input, Upload } from "antd";
import { uploadFileToFirebaseAndReturnUrl } from "@/helpers/uploads";

function CastAndCrew({
  activeStep,
  setActiveStep,
  showFormData,
  setShowFormData,
}: ShowFormStepsProps) {
  const addNewHandler = () => {
    const existingCastAndCrew = showFormData.castAndCrew || [];
    existingCastAndCrew.push({
      name: "",
      role: "",
      imageUrl: "",
    });
    setShowFormData({
      ...showFormData,
      castAndCrew: existingCastAndCrew,
    });
  };

  const onCastAndCrewChange = (index: number, key: string, value: string) => {
    const newCastAndCrew = [...showFormData.castAndCrew];
    newCastAndCrew[index][key] = value;
    setShowFormData({
      ...showFormData,
      castAndCrew: newCastAndCrew,
    });
  };

  const onCastAndCrewDelete = (index: number) => {
    const newCastAndCrew = [...showFormData.castAndCrew];
    newCastAndCrew.splice(index, 1);
    setShowFormData({
      ...showFormData,
      castAndCrew: newCastAndCrew,
    });
  };

  const handleUpload = async (index: number, file: any) => {
    try {
      const downloadUrl = await uploadFileToFirebaseAndReturnUrl(file);
      onCastAndCrewChange(index, "imageUrl", downloadUrl);
    } catch (error:any) {
      console.error("Upload failed", error.message);
    }
  };

  const getFilesListArray = (fileOrUrl: any) => {
    if (!fileOrUrl) return [];

    if (typeof fileOrUrl === "string") {
      return [{ url: fileOrUrl }];
    }
    return [
      {
        ...fileOrUrl,
        url: URL.createObjectURL(fileOrUrl),
      },
    ];
  };

  const disableNextButton = showFormData?.castAndCrew?.some(
    (person: any) => !person.name || !person.role
  );

  return (
    <div>
      <div className="flex justify-end">
        <Button onClick={addNewHandler}>Add New</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
        {showFormData?.castAndCrew?.map((person: any, index: number) => (
          <div key={index} className="flex flex-col gap-5 border border-solid border-black p-3 rounded-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-gray-500 font-semibold text-sm">
                {index + 1}
              </h1>
              <Button size="small" onClick={() => onCastAndCrewDelete(index)}>
                Delete
              </Button>
            </div>
            <Form.Item label="Name" required>
              <Input
                value={person.name}
                onChange={(e) =>
                  onCastAndCrewChange(index, "name", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Role" required>
              <Input
                value={person.role}
                onChange={(e) =>
                  onCastAndCrewChange(index, "role", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item label="Image Upload">
              <Upload
                listType="picture-card"
                beforeUpload={(file) => {
                  handleUpload(index, file);
                  return false;
                }}
                accept="image/*"
                maxCount={1}
                fileList={getFilesListArray(person.imageUrl)}
              >
                <div className="text-xs">
                  {person.imageUrl ? "Change" : "Upload"}
                </div>
              </Upload>
            </Form.Item>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-7 mt-10">
        <Button onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
        <Button
          type="primary"
          onClick={() => setActiveStep(activeStep + 1)}
          disabled={disableNextButton}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default CastAndCrew;
