const cl = console.log;
const postcontainer = document.getElementById("postcontainer");
const postform = document.getElementById("postForm");
const titlecontrol= document.getElementById("title");
const bodycontrol= document.getElementById("body");
const useridcontrol=document.getElementById("userId");
const updateBtn =document.getElementById("updateBtn");
const submitBtn = document.getElementById("submitBtn");
const lader= document.getElementById("lader");




 let baseUrl = `https://crud-posts-3f2ab-default-rtdb.asia-southeast1.firebasedatabase.app`;

 let postUrl =`${baseUrl}/posts.json`
 //cl(postsUrl)//

 




 const onEdit = (ele)=>{
  //cl(ele) /// betton

  let editId = ele.closest(".card").id;
  localStorage.setItem("editId",editId)
  let editUrl =`${baseUrl}/posts/${editId}.json` 


      makeApiCall("GET",editUrl)
      .then(res =>{
        cl(res)
        let post = JSON.parse(res);
        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");
        titlecontrol.value = post.title; 
        bodycontrol.value = post.body;
        useridcontrol.value = post.userid;






      })
      .catch(err =>{
        cl(err)
      })
      
 }



 const onDelet = (ele)=>{
  //cl(ele) 
  let deleteId = ele.closest(".card").id
  let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;
      makeApiCall("DELETE", deleteUrl)
      .then(res =>{
        cl(res)
        let deletecard = document.getElementById(deleteId)
        deletecard.remove()
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          
        });
      }) 
      .catch(cl)
    
 }

 const createcard = (postObj) =>{
  let card = document.createElement("div") 
  card.className = "card mb-4";
  card.id = postObj.id;  
  card.innerHTML = `
                  
                  <div class="card-header">
                        <h2>${postObj.title}</h2>
                  </div>
                   <div class="card-body">
                  <p>
                  
                         ${postObj.body}
                   </p>
                 </div>
                    <div class="card-footer d-flex justify-content-between">
                     <button class="btn btn-primary" onclick="onEdit(this)">
                                      Edit
                         </button>
                      <button class="btn btn-danger" onclick="onDelet(this)">
                                       Delete
                       </button>
                      </div>
                    
  
  
  `
  postcontainer.append(card)

 }

 

const objToArr =(obj) =>{
  let arr = [];
  for (const key in obj) {
  let newObj = obj[key];
  newObj.id =key;
  arr.push(newObj)
  }
  return arr;
}

const templatingofPosts = (posts)=>{
    posts.forEach(post => { 
      createcard(post)

    });
}


 const makeApiCall = (methodName,apiUrl,body = null) =>{
  lader.classList.remove('d-none');
    return new Promise((resolve,reject)=>{
     
      let xhr = new XMLHttpRequest();
      xhr.open(methodName,apiUrl);

      xhr.send(body); 

      xhr.onload = function(){
        lader.classList.add('d-none')
        if(xhr.status >=200 && xhr.status <300){
          resolve(xhr.responseText);
        
          
        }else{
          reject(xhr.statusText) 
          
        }
      }
    })
 }


 makeApiCall("GET",postUrl) 
  .then(res =>{
    //cl(res) 
    let data = JSON.parse(res);
    //cl(data)
   let postArr = objToArr(data)
   cl(postArr);
   templatingofPosts(postArr);
    
    
  })
  .catch(cl)









const onPostSubmit = (eve)=>{
    eve.preventDefault();
    let newPost = {
      title : titlecontrol.value,
      body : bodycontrol. value,
      userid : useridcontrol.value

    }
    cl(newPost) 
    makeApiCall("POST",postUrl,JSON.stringify(newPost))
    .then(res=>{
      cl(res)
      let post = newPost;
      post.id = JSON.parse(res).name
      createcard(post)

    })
    .catch(cl)
    .finally(()=>{
      eve.target.reset()
      
      
    })
}
const onupdate = (ele) =>{
  //cl(ele)
  let updId = localStorage.getItem("editId");
  let updUrl = `${baseUrl}/posts/${updId}.json`
  let updatedobj = {
    title : titlecontrol.value,
    body : bodycontrol.value,
    userid: useridcontrol.value,
    id : updId.id
    
  }
  makeApiCall ("PUT",updUrl,JSON.stringify(updatedobj))
    .then(res =>{
      cl(res);
      let newobj1 = JSON.parse(res)
      let getCard = document.getElementById(updId)
      cl(getCard)
      let cardChild =[...getCard.children]
      cl(cardChild)
      cardChild [0].innerHTML = `<h2>${updatedobj.title}</h2>`
      cardChild [1].innerHTML = `<p>${updatedobj.body}</p>`
    })
    .catch(cl)
    .finally(()=>{
      postform.reset()
      updateBtn.classList.add("d-none");
        submitBtn.classList.remove("d-none");


    }) 
}
  

 
  updateBtn.addEventListener("click",onupdate)
  postform .addEventListener("submit",onPostSubmit)