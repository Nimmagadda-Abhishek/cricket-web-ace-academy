# Cricket Academy Database Management Script

Write-Host "🏏 Cricket Academy Database Management" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Test 1: Database Statistics
Write-Host "`n📊 Testing Database Statistics..." -ForegroundColor Yellow
try {
    node -e "
    import('./src/scripts/db-manager.js').then(module => {
        const { DatabaseManager } = module;
        const db = new DatabaseManager();
        db.connect().then(() => {
            return db.getDatabaseStats();
        }).then(stats => {
            console.log('📊 Database Statistics:');
            console.table(stats);
            return db.disconnect();
        }).catch(error => {
            console.error('❌ Error:', error.message);
            db.disconnect();
        });
    });
    "
} catch {
    Write-Host "❌ Database stats test failed" -ForegroundColor Red
}

# Test 2: Upload sample students
Write-Host "`n📤 Uploading Sample Students..." -ForegroundColor Yellow
try {
    $studentsJson = Get-Content "src/scripts/sample-students.json" | ConvertFrom-Json
    Write-Host "✅ Found $($studentsJson.Count) students in sample file" -ForegroundColor Green
    
    # Use API to upload students
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    # Login first
    $loginData = @{
        username = "admin"
        password = "admin"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-WebRequest -Uri "https://cricket-web-ace-academy.onrender.com/api/auth/login" -Method POST -Body $loginData -Headers $headers
        $loginResult = $loginResponse.Content | ConvertFrom-Json
        
        if ($loginResult.success) {
            Write-Host "✅ Admin login successful" -ForegroundColor Green
            $authToken = $loginResult.data.token
            
            $authHeaders = @{
                "Content-Type" = "application/json"
                "Authorization" = "Bearer $authToken"
            }
            
            # Upload each student
            $successCount = 0
            $errorCount = 0
            
            foreach ($student in $studentsJson) {
                try {
                    $studentJson = $student | ConvertTo-Json
                    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/students" -Method POST -Body $studentJson -Headers $authHeaders
                    $result = $response.Content | ConvertFrom-Json
                    
                    if ($result.success) {
                        Write-Host "✅ Student '$($student.name)' uploaded successfully" -ForegroundColor Green
                        $successCount++
                    } else {
                        Write-Host "❌ Failed to upload '$($student.name)': $($result.message)" -ForegroundColor Red
                        $errorCount++
                    }
                } catch {
                    Write-Host "❌ Error uploading '$($student.name)': $($_.Exception.Message)" -ForegroundColor Red
                    $errorCount++
                }
            }
            
            Write-Host "`n📊 Upload Summary:" -ForegroundColor Cyan
            Write-Host "   ✅ Success: $successCount" -ForegroundColor Green
            Write-Host "   ❌ Errors: $errorCount" -ForegroundColor Red
            Write-Host "   📝 Total: $($studentsJson.Count)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Server not running or login failed. Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Student upload test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Upload sample programs
Write-Host "`n📤 Uploading Sample Programs..." -ForegroundColor Yellow
try {
    $programsJson = Get-Content "src/scripts/sample-programs.json" | ConvertFrom-Json
    Write-Host "✅ Found $($programsJson.Count) programs in sample file" -ForegroundColor Green
    
    # Note: Programs endpoint might need admin auth - this is just for demonstration
    Write-Host "ℹ️  Programs can be uploaded via the admin dashboard or API" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Program upload test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Database Management Test Complete!" -ForegroundColor Green
Write-Host "💡 To manage data:" -ForegroundColor Yellow
Write-Host "   1. Start the backend server: npm run dev" -ForegroundColor White
Write-Host "   2. Open admin-dashboard.html in your browser" -ForegroundColor White
Write-Host "   3. Login with username: admin, password: admin" -ForegroundColor White
Write-Host "   4. Use the web interface to manage data" -ForegroundColor White
