function OrderDeleteConfirmation({ handleDeleteConfirm,handleDeleteCancel}:
     {handleDeleteConfirm: any;handleDeleteCancel: any}) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] backdrop-blur-sm">
        <div className="popup-animation bg-white p-5 rounded-lg shadow-lg">
          {
            <p className="text-lg text-gray-900 font-bold text-wrap">
            Are you sure you want to cancel this order?</p> }
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              className="border-2 border-gray-700 text-gray-800 px-4 py-2 rounded"
              onClick={handleDeleteCancel}
            >
              No
              
            </button>
            <button
              className="bg-[#EA002A] px-4 py-2 rounded text-white disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC]"
              onClick={handleDeleteConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default OrderDeleteConfirmation;
  