import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FileUploader({ className, file, process, handleChange }) {
  return (
    <div
      className={`${className} flex items-center flex-col w-full p-[10px] w-100%`}
    >
      <div className="border-2 border-dashed border-[var(--main-color)] rounded-lg flex flex-col items-center justify-center">
        <FontAwesomeIcon
          icon={faCloudArrowUp}
          className="text-[40px] mb-[30px]"
        />
        <span className="text-[18px] text-black font-[500]">
          Drag and Drop file to upload
        </span>
        <span className="font-[500] mb-2 text-black">or</span>
        <label
          className=" cursor-pointer p-2 text-white bg-[var(--main-color)] rounded-lg"
          htmlFor="input-file"
        >
          Browser
        </label>
        <input
          type="file"
          hidden
          id="input-file"
          onChange={(e) => {
            handleChange(e.target.files[0]);
          }}
        />
        <div className="pt-6">
          <ul>
            <li className="flex items-center justify-center flex-col">
              <div className="flex justify-center items-center min-w-[200px]">
                <span className="overflow-hidden mb-2 w-[300px] text-center">
                  {file !== null && file !== undefined
                    ? file.name
                    : "No file selected"}
                </span>
              </div>
              <div className="w-full flex items-center justify-center flex-col relative">
                <span
                  className="absolute left-0 w-[0] h-[4px] rounded-lg bg-[var(--main-color)] transition-all duration-100 ease-linear"
                  style={{ width: `${process}%` }}
                ></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
