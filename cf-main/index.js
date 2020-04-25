
const COOKIE_NAME = 'prev_url'

class ElementHandler1 {
  element(element) {
  	if (element.tagName === 'title'){
  		const title = element.setInnerContent('Modified Variant 1')
  	}
  	else if(element.tagName === 'p'){
  		const desc = element.setInnerContent("Started(15-04)--->(learn node.js for CloudFlare challenge)--->Completed(16-04) ! 24 hours well spent D")
  	}  
  	else if(element.tagName === 'h1'){
  		const hTitle = element.setInnerContent("Code by SaipranavK")
  	}  
  	else if(element.tagName === 'a'){
  		const ahref = element.setAttribute("href","https://www.linkedin.com/in/saipranavkoyyada/")
  		const atarget = element.setAttribute("target","_blank")
  		const ainner = element.setInnerContent("View my profile")
  	} 
  }
}

class ElementHandler2 {
  element(element) {
  	if (element.tagName === 'title'){
  		const title = element.setInnerContent('Modified Variant 2')
  	}
  	else if(element.tagName === 'p'){
  		const desc = element.setInnerContent("Please, Take me in! LOVE CLOUDFLARE")
  	}  
  	else if(element.tagName === 'h1'){
  		const hTitle = element.setInnerContent("Code by SaipranavK")
  	}  
  	else if(element.tagName === 'a'){
  		const ahref = element.setAttribute("href","https://www.jntuh-cehcc.org/")
  		const atarget = element.setAttribute("target","_blank")
  		const ainner = element.setInnerContent("See what i built with django")
  	} 
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
	
	const main = "https://cfw-takehome.developers.workers.dev/api/variants"
	const api_urls_arr = await fetch(main)
	.then((response) => {
		return response.json()
	})
	.then(data => {
		console.log(data)
		return data['variants']
	})

	console.log("fetch op:"+api_urls_arr)

	const cookie = getCookie(request, COOKIE_NAME)

	if(cookie == '0'){
		console.log("0 r:"+cookie)

		const out = await fetch(api_urls_arr[1],request)
		.then((response) => {
			return response.text()
		})

		const res = new Response(out,{
			'headers':{ 'content-type': 'text/html'
			}
		})
		res.headers.append('set-cookie','prev_url=1')
		rewrite = new HTMLRewriter().on('title', new ElementHandler1()).on('p#description', new ElementHandler1()).on('h1#title', new ElementHandler1()).on('a#url', new ElementHandler1()).transform(res)

		return rewrite

	}


	else if(cookie == '1'){
		console.log("1 r:"+cookie)

		const out = await fetch(api_urls_arr[0],request)
		.then((response) => {
			return response.text()
		}).then(data => {
			console.log
			return data
		})

		const res = new Response(out,{
			'headers':{ 'content-type': 'text/html'}
		})
		res.headers.append('set-cookie','prev_url=0')
		rewrite = new HTMLRewriter().on('title', new ElementHandler2()).on('p#description', new ElementHandler2()).on('h1#title', new ElementHandler2()).on('a#url', new ElementHandler2()).transform(res)

		return rewrite

	}

	else{
		
		var route = rand(0,1)
		console.log("e r:"+cookie)

		const out = await fetch(api_urls_arr[route],request)
		.then((response) => {
			return response.text()
		}).then(data => {
		return data
	})

		
		if(route == 0){
			const res = new Response(out,{
			'headers':{ 'content-type': 'text/html',
			'set-cookie': 'prev_url=0'
				}
			})
			rewrite = new HTMLRewriter().on('title', new ElementHandler1()).on('p#description', new ElementHandler1()).on('h1#title', new ElementHandler1()).on('a#url', new ElementHandler1()).transform(res)
	
		}

		else if (route == 1){
			const res = new Response(out,{
			'headers':{ 
				'content-type': 'text/html',
				'set-cookie': 'prev_url=1'
				}
			})
			rewrite = new HTMLRewriter().on('title', new ElementHandler2()).on('p#description', new ElementHandler2()).on('h1#title', new ElementHandler2()).on('a#url', new ElementHandler2()).transform(res)
		}
		
		return rewrite
	}
}

function rand(min, max) {  
	return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

function getCookie(request, name) {
	let result = null
	let cookieString = request.headers.get('cookie')
	console.log(cookieString)
	if (cookieString) {
	    let cookies = cookieString.split(';')
	    cookies.forEach(cookie => {
      	let cookieName = cookie.split('=')[0].trim()
      	console.log(cookieName)
      	if (cookieName == name) {
        	let cookieVal = cookie.split('=')[1]
        	result = cookieVal
        	console.log("cookie found: "+cookieVal)
        }
    	})
  	}
  	return result
}