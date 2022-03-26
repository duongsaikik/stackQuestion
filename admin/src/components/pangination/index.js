import React from "react";
import { useRouter } from "./useRouter";


const Panginations = ({
    currentPage,
    totalPage
}) =>{
  const highlight = {
    backgroundColor: 'green',
    pointerEvents: 'none',
    color: 'white'
  
}
const none = {

}

    const router = useRouter()
    const range = 5;
    const handlePage = async (e) => {
      console.log(e)
      const currentPath = router.pathname;
      const currentQuery = router.query;
  
      currentQuery.pagee = e;
      router.push(`${currentPath}?pagee=${currentQuery.pagee}`)
    }
    const handleChangePage = async (e) => {
      const i = Number(e.target.attributes.num.value);
      
      const currentPath = router.pathname;
      const currentQuery = router.query;
    
      currentQuery.pagee = i === 1 ? currentPage - 1 : currentPage + 1;

      router.push(`${currentPath}?pagee=${currentQuery.pagee}`)
    }
    const showPagination = (e) => {
        var page = [];
        var result = '';
        var start = 1;
        var end = totalPage;  
          if(currentPage >= range){    
              if(currentPage + 2 < e ){
                start = currentPage - 2;
                end = currentPage + 2;
              }else{
                  start = e - 4;
                  end = e;
              }       
          }else if(e > range){
              end = range;
          }
          for (let i = start; i <= end; i++) {    
            page.push(Number(i))
          }   
        result = page.length > 0 ? page.map((item, index) => {
        
          return <li key={index}
          className='page-link'  style={
            currentPage >= range ? 
          index * 0 + item === currentPage ?
             highlight :
             none :
               index + 1 === currentPage ?
               highlight : 
               none
              } onClick={() => {handlePage(currentPage >= range ?  index * 0 + item : index + 1 )}}>{item}</li>
        })
          : '';
        return result;
      }
         
    return(
        <>
        
         { totalPage > 1 ?
        <nav aria-label="Page navigation example" className="pt_outline">
           <ul className="pagination justify-content-center">
            {
              currentPage === 1 || currentPage === 0 ? '' : <a class="page-link" num='1' onClick={handleChangePage} >
              Previous
            </a>
            }
            {
              totalPage > range ? currentPage  > range - 1  ? <span className='more_page' onClick={() => handlePage(1)}>1</span>:'':''
            }
            {
              totalPage > range ? currentPage  > range - 1 ? <span className='more_page'>...</span>:'':''
            }
           
              {
                showPagination(totalPage)
              }
           
            {
              totalPage > range ?  currentPage + 2 < totalPage ? <span className='more_page'>...</span>:'':''
            }
            {
              totalPage > range ? currentPage + 2 < totalPage ? <span className='totalPage more_page' onClick={() => handlePage(totalPage)}>{totalPage}</span>:'':''
            }
            {            
              currentPage === totalPage || totalPage === 0 ? '' :  <a class="page-link" num='2' onClick={handleChangePage}>
              Next
            </a>
            }
 </ul>
          </nav>
    
        :
        ''
      }
        </>
    )
}
export default Panginations;