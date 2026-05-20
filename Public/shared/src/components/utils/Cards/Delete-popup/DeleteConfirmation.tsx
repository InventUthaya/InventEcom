function DeleteConfirmation({
  handleDeleteConfirm,
  handleDeleteCancel,
  isOrder
}: {
  handleDeleteConfirm: any;
  handleDeleteCancel: any;
  isOrder:any
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000] backdrop-blur-sm">
      <div className="popup-animation bg-white p-5 rounded-lg shadow-lg">
        {isOrder ?<p className="text-lg text-gray-900 font-bold text-wrap">
          Cannot delete this Address. There are orders against this Address.</p> :
          <p className="text-lg text-gray-900 font-bold text-wrap">
          Are you sure you want to delete this address?</p> }
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            className="border-2 border-gray-700 text-gray-800 px-4 py-2 rounded"
            onClick={handleDeleteCancel}
          >
            {isOrder ? "Ok" : "No"}
            
          </button>
          <button
            className="bg-[#EA002A] px-4 py-2 rounded text-white disabled:bg-[#EBEBEB] disabled:text-[#BCBCBC]"
            onClick={handleDeleteConfirm}
            disabled={isOrder}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
